from django.shortcuts import redirect, render
from django.conf import settings
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
import stripe.error

from userauth.models import User
from store.models import Category, Product, Tax, Size, Color, Specification, Cart, CartOrder, CartOrderItem, Reviews, Wishlist, ProductFAQ, Gallery, Notification, Coupon
from store.serializers import CartOrderSerializer, CartSerializer, ProductSerializer, CategorySerializer, CouponSerializer, NotificationSerializer, ReviewsSerializer, WishlistSerializer

from decimal import Decimal
import requests
import stripe


class OrdersAPIView(generics.ListAPIView):
    serializer_class = CartOrderSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id=user_id)

        orders = CartOrder.objects.filter(buyer=user, payment_status="paid")
        return orders

class OrderDetailsAPIView(generics.RetrieveAPIView):
    serializer_class = CartOrderSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        user_id = self.kwargs['user_id']
        order_id = self.kwargs['order_id']

        user = User.objects.get(id=user_id)
        order = CartOrder.objects.get(buyer=user, order_id=order_id, payment_status="paid")

        return order

class WishlistAPIView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id=user_id)
        wishlist = Wishlist.objects.filter(user=user)

        return wishlist
    
    def create(self, request, *args, **kwargs):
        payload = request.data
        product_id = payload['product_id']
        user_id = payload['user_id']

        product = Product.objects.get(id=product_id)
        user = User.objects.get(id=user_id)

        wishlist = Wishlist.objects.filter(product=product, user=user)
        if wishlist:
            wishlist.delete()
            return Response({'message': "Wishlist deleted successfully."}, status=status.HTTP_200_OK)
        else:
            Wishlist.objects.create(user=user, product=product)
            return Response({'message': 'Wishlist created successfully.'}, status=status.HTTP_201_CREATED)


class CustomerNotificationAPIView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id=user_id)
        notifications = Notification.objects.filter(user=user, seen=False)

        return notifications

class MarkCustomerNotificationAsSeen(generics.RetrieveAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        user_id = self.kwargs['user_id']
        notification_id = self.kwargs['notification_id']

        user = User.objects.get(id=user_id)
        notification = Notification.objects.get(id=notification_id, user=user)

        if notification.seen != True:
            notification.seen = True
            notification.save()
        return notification
