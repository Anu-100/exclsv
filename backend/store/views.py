from django.shortcuts import redirect
from django.conf import settings
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
import stripe.error

from userauth.models import User
from store.models import Category, Product, Tax, Size, Color, Specification, Cart, CartOrder, CartOrderItem, Reviews, Wishlist, ProductFAQ, Gallery, Notification, Coupon
from store.serializers import CartOrderSerializer, CartSerializer, ProductSerializer, CategorySerializer, CouponSerializer, NotificationSerializer, ReviewsSerializer

from decimal import Decimal
import requests
import stripe


stripe.api_key = settings.STRIPE_SECRET_KEY


class CategoryListAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class ProductListAPIView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

class CategoryProductsListAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        category = self.request.GET.get('category', None)
        if category is not None:
            products = Product.objects.filter(category__title=category)
        return products

class ProductDetailAPIView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        slug = self.kwargs['slug']
        return Product.objects.get(slug=slug)
    
class CartAPIView(generics.ListCreateAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        payload = request.data
         
        pid = payload['product_id']
        user_id = payload['user_id']
        quantity = payload['quantity']
        shipping_cost = payload['shipping_cost']
        price = payload['price']
        country = payload['country']
        cart_id = payload.get('cart_id')
        size = payload['size']
        color = payload['color']
        
        product = Product.objects.get(id=pid)

        if user_id != "undefined":
            user = User.objects.get(id=user_id)
        else:
            user = None

        tax = Tax.objects.filter(country=country).first()
        if tax:
            tax_rate = tax.rate / 100
        else:
            tax_rate = 0

        # Update the existing cart with the latest data. If the cart doens't exist we create a new one
        cart = Cart.objects.filter(cart_id=cart_id, product=product).first()
        print(cart)
        if cart:
            cart.product = product
            cart.user = user
            cart.quantity = quantity
            cart.price = price
            cart.sub_total = Decimal(price) * int(quantity)
            cart.tax_fee = int(quantity) * Decimal(tax_rate)
            cart.color = color
            cart.size = size
            cart.country = country
            cart.cart_id = cart_id

            if cart.sub_total > 500.00:
                cart.shipping_cost = Decimal(0.00)
            else:
                cart.shipping_cost = Decimal(shipping_cost)

            service_fee_percentage = 2 / 100
            cart.service_fee = Decimal(service_fee_percentage) * cart.sub_total

            cart.total = cart.sub_total + cart.shipping_cost + cart.service_fee + cart.tax_fee
            cart.save()

            return Response({"message": 'Cart updated successfully!'}, status=status.HTTP_200_OK)

        else:
            cart = Cart()
            cart.product = product
            cart.user = user
            cart.quantity = quantity
            cart.price = price
            cart.sub_total = Decimal(price) * int(quantity)
            cart.tax_fee = int(quantity) * Decimal(tax_rate)
            cart.color = color
            cart.size = size
            cart.country = country
            cart.cart_id = cart_id

            if cart.sub_total > 500.00:
                cart.shipping_cost = Decimal(0.00)
            else:
                cart.shipping_cost = Decimal(shipping_cost)

            service_fee_percentage = 2 / 100
            cart.service_fee = Decimal(service_fee_percentage) * cart.sub_total

            cart.total = cart.sub_total + cart.shipping_cost + cart.service_fee + cart.tax_fee
            cart.save()

            return Response({"message": "Cart created successfully"}, status=status.HTTP_201_CREATED)


class CartListView(generics.ListAPIView):
    serializer_class = CartSerializer
    permission_classes = [AllowAny]
    queryset = Cart.objects.all()

    def get_queryset(self):
        cart_id = self.kwargs['cart_id']
        user_id = self.kwargs['user_id']

        if user_id is not None:
            user = User.objects.get(id=user_id)
            queryset = Cart.objects.filter(user=user, cart_id=cart_id)
        else:
            queryset = Cart.objects.filter(cart_id=cart_id)
        
        return queryset

class CartDetailView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [AllowAny]
    lookup_field = "cart_id"

    def get_queryset(self):
        cart_id = self.kwargs['cart_id']
        user_id = self.kwargs.get('user_id')
        if user_id is not None:
            user = User.objects.get(id=user_id)
            queryset = Cart.objects.filter(user=user, cart_id=cart_id)
        else:
            queryset = Cart.objects.filter(cart_id=cart_id)

        return queryset

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        cumulative_shipping = 0.00
        cumulative_tax_fee = 0.00
        cumulative_service_fee = 0.00
        cumulative_sub_total = 0.00
        cumulative_total = 0.00

        for cart_item in queryset:
            cumulative_shipping += float(self.calculate_shipping(cart_item))
            cumulative_tax_fee += float(self.calculate_tax(cart_item))
            cumulative_service_fee += float(self.calculate_service_fee(cart_item))
            cumulative_sub_total += float(self.calulate_subtotal(cart_item))
            cumulative_total += float(self.calculate_total(cart_item))
            
        data = {
            "shipping": cumulative_shipping,
            "tax": cumulative_tax_fee,
            "service_fee": cumulative_service_fee,
            "sub_total": cumulative_sub_total,
            "total": cumulative_total,
        }

        return Response(data)

    def calculate_shipping(self, cart_item):
        return cart_item.shipping_cost
    
    def calculate_tax(self, cart_item):
        return cart_item.tax_fee
    
    def calculate_service_fee(self, cart_item):
        return cart_item.service_fee
    
    def calulate_subtotal(self, cart_item):
        return cart_item.sub_total
    
    def calculate_total(self, cart_item):
        return cart_item.total
    

class CartItemDeleteAPIView(generics.DestroyAPIView):
    serializer_class = CartSerializer
    permission_classes = [AllowAny]
    lookup_field = "cart_id"

    def get_object(self):
        cart_id = self.kwargs['cart_id']
        item_id = self.kwargs['item_id']
        user_id = self.kwargs.get('user_id')

        if user_id:
            user = User.objects.get(id=user_id)
            cart = Cart.objects.get(id=item_id, cart_id=cart_id, user=user)
        else:
            cart = Cart.objects.get(id=item_id, cart_id=cart_id)

        return cart


class CreateOrderAPIView(generics.CreateAPIView):
    serializer_class = CartOrderSerializer
    queryset = CartOrder.objects.all()
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        payload = request.data
        full_name = payload['full_name']
        email = payload['email']
        mobile = payload['mobile']
        address = payload['address']
        city = payload['city']
        state = payload['state']
        country = payload['country']
        cart_id = payload['cart_id']
        user_id = payload['user_id']

        if user_id != 0:
            user = User.objects.get(id=user_id)
        else:
            user = None
        
        cart_items = Cart.objects.filter(cart_id=cart_id)

        cumulative_shipping = Decimal(0.00)
        cumulative_tax = Decimal(0.00)
        cumulative_service_fee = Decimal(0.00)
        cumulative_sub_total = Decimal(0.00)
        cumulative_initial_total = Decimal(0.00) # in case the user applies a coupon
        cumulative_total = Decimal(0.00)

        order = CartOrder.objects.create(
            buyer=user,
            full_name=full_name,
            email=email,
            mobile=mobile,
            address=address,
            city=city,
            state=state,
            country=country,
        )

        for item in cart_items:
            CartOrderItem.objects.create(
                order=order,
                products=item.product,
                quantity=item.quantity,
                color=item.color,
                size=item.size,
                price=item.price,
                sub_total=item.sub_total,
                shipping_cost=item.shipping_cost,
                service_fee=item.service_fee,
                tax_fee=item.tax_fee,
                total=item.total,
                initial_total=item.total
            )

            cumulative_shipping += Decimal(item.shipping_cost)
            cumulative_tax += Decimal(item.tax_fee)
            cumulative_service_fee += Decimal(item.service_fee)
            cumulative_sub_total += Decimal(item.sub_total)
            cumulative_initial_total += Decimal(item.total)
            cumulative_total += Decimal(item.total)

            order.vendor.add(item.product.vendor)

        order.sub_total = cumulative_sub_total
        order.shipping_cost = cumulative_shipping
        order.tax_fee = cumulative_tax
        order.service_fee = cumulative_service_fee
        order.initial_total = cumulative_initial_total
        order.total = cumulative_total

        order.save()

        return Response({"message": 'Order created successfully!', "order_id": order.order_id}, status=status.HTTP_201_CREATED)
        

class CheckoutView(generics.RetrieveAPIView):
    serializer_class = CartOrderSerializer
    permission_classes = [AllowAny]
    lookup_field = 'order_id'

    def get_object(self):
        order_id = self.kwargs['order_id']
        order = CartOrder.objects.get(order_id=order_id)
        return order

class CouponAPIView(generics.CreateAPIView):
    serializer_class = CouponSerializer
    permission_classes = [AllowAny]
    queryset = Coupon.objects.all() 

    def create(self, request, *args, **kwargs):
        payload = request.data
        coupon_code = payload['coupon_code']
        order_id = payload['order_id']

        order = CartOrder.objects.get(order_id=order_id)
        coupon = Coupon.objects.filter(code=coupon_code).first()

        if coupon:
            order_items = CartOrderItem.objects.filter(order=order, vendor=coupon.vendor)
            if order_items:
                for i in order_items:
                    if not coupon in i.coupon.all():
                        discount = i.total * coupon.discount / 100
                        i.total -= discount
                        i.sub_total -= discount
                        i.coupon.add(coupon)
                        i.saved += discount

                        order.total -= discount
                        order.sub_total -= discount
                        order.saved += discount

                        i.save() 
                        order.save()

                        return Response({'message': "Coupon activated", "icon": "success"}, status=status.HTTP_200_OK)
                    else:
                        return Response({'message': "Coupon already applied", "icon": "warning"}, status=status.HTTP_200_OK)
            else:
                return Response({'message': "No order items found", "icon": "error"}, status=status.HTTP_200_OK)
        else:
            return Response({'message': "Coupon not found", "icon": "error"}, status=status.HTTP_200_OK)

 
class StripeCheckoutAPIView(generics.CreateAPIView):
    serializer_class = CartOrderSerializer
    permission_classes = [AllowAny]
    queryset = CartOrder.objects.all()

    def create(self, request, *args, **kwargs):
        order_id = self.kwargs['order_id']
        order = CartOrder.objects.get(order_id=order_id)

        if not order:
            return Response({'message': "Order not found", "icon": "error"}, status=status.HTTP_404_NOT_FOUND)
        else:
            try:
                checkout_session = stripe.checkout.Session.create(
                customer_email=order.email,
                payment_method_types=['card'],
                line_items=[
                    {
                        'price_data': {
                            'currency': 'INR',
                            'product_data':{
                                'name': order.full_name,
                            },
                            'unit_amount': int(order.total * 100),
                        },
                        'quantity': 1,
                    }
                ],                
                mode='payment',
                success_url='http://localhost:5173/payment-success/' + order.order_id + '?session_id={CHECKOUT_SESSION_ID}',
                cancel_url='http://localhost:5173/payment-failed/?session_id={CHECKOUT_SESSION_ID}'
            )
                order.stripe_session_id = checkout_session.id
                order.save()

                return redirect(checkout_session.url)
            except stripe.error.StripeError as e:
                return Response({'error': e._message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PaymentSuccessAPIView(generics.CreateAPIView):    
    serializer_class = CartOrderSerializer
    permission_classes = [AllowAny]
    queryset = CartOrder.objects.all() 

    def create(self, request, *args, **kwargs):
        payload = request.data
        order_id = payload['order_id']
        session_id = payload['session_id']

        order = CartOrder.objects.get(order_id=order_id)
        order_items = CartOrderItem.objects.filter(order=order)

        if session_id != 'null':
            session =stripe.checkout.Session.retrieve(session_id)

            if session.payment_status == 'paid':
                if order.payment_status == 'pending':
                    order.payment_status = 'paid'
                    order.save()

                    if order.buyer != None:
                        send_notification(user=order.buyer, order=order)    
                    
                    for o in order_items:
                        send_notification(vendor=o.vendor, order=order, order_item=o)
                    
                    context = {'order': order, 'order_items': order_items}
                    html_body = render_to_string("email/customer_order_confirmation.html", context=context)
                    msg = EmailMultiAlternatives(
                        subject="Order Confirmation", 
                        from_email=settings.EMAIL_HOST_USER, 
                        to=[order.email],
                        body="Your order details:\n\n"
                        )
                    msg.attach_alternative(html_body,"text/html")
                    msg.send()
                                        
                    Cart.objects.filter(user=order.buyer).delete()
                    return Response({"message": "Payment successful!"})
                else:
                    return Response({"message": "Already paid"})
            elif session.payment_status == 'unpaid':
                return Response({"message": "Your invoice is unpaid"})
            elif session.payment_status == 'cancelled':
                return Response({"message": "Your invoice was cancelled"})
            else:
                return Response({"message": "An error occured, try again!"})
        else:
            session = None
    



def send_notification(user=None, vendor=None, order=None, order_item=None):
    Notification.objects.create(
        user=user,
        vendor=vendor,
        order=order,
        order_item=order_item
    )


class ReviewListAPIView(generics.ListCreateAPIView):
    serializer_class = ReviewsSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        product_id = self.kwargs['product_id']       
        product = Product.objects.get(id=product_id)
        reviews = Reviews.objects.filter(product=product)
        return reviews
    
    def create(self, request, *args, **kwargs):
        payload = request.data
        user_id = payload['user_id']
        product_id = payload['product_id']
        rating = payload['rating']
        review = payload['review']
        user = User.objects.get(id=user_id)
        product = Product.objects.get(id=product_id)
        review = Reviews.objects.create(
            user = user,
            product = product,
            rating = rating,
            review = review
        )
        return Response({"message": "Review created successfully"}, status=status.HTTP_200_OK)

class SearchProductAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        query = self.request.GET.get('query')
        products =Product.objects.filter(status='published', title__icontains=query)
        return products

