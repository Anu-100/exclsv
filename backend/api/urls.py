from django.urls import path
from userauth import views as userauth_views
from store import views as store_views
from vendor import views as vendor_views
from customer import views as customer_views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('user/token/', userauth_views.MyTokenObtainPairView.as_view()),
    path('user/token/refresh/', TokenRefreshView.as_view()),
    path('user/register/', userauth_views.RegisterView.as_view()),
    path('user/password-reset/<email>/', userauth_views.PasswordResetEmailVerifyView.as_view()),
    path('user/password-change/', userauth_views.PasswordChangeView.as_view()),
    path('user/profile/<int:user_id>/', userauth_views.ProfileView.as_view()),

    # Store endpoints
    path('category/', store_views.CategoryListAPIView.as_view()),
    path('products/', store_views.ProductListAPIView.as_view()),
    path('products/<slug>/', store_views.ProductDetailAPIView.as_view()),
    path('cart/<int:user_id>/', store_views.CartAPIView.as_view()),
    path('cart-list/<str:cart_id>/<int:user_id>/', store_views.CartListView.as_view()),
    path('cart-details/<str:cart_id>/<int:user_id>/', store_views.CartDetailView.as_view()),
    path('cart-delete/<str:cart_id>/<int:item_id>/<int:user_id>/', store_views.CartItemDeleteAPIView.as_view()),
    path('cart-delete/<str:cart_id>/<int:item_id>/', store_views.CartItemDeleteAPIView.as_view()),
    path('create-order/<str:cart_id>/', store_views.CreateOrderAPIView.as_view()),
    path('checkout/<str:order_id>/', store_views.CheckoutView.as_view()),
    path('coupon/', store_views.CouponAPIView.as_view()),
    path('reviews/<int:product_id>/', store_views.ReviewListAPIView.as_view()),
    path('search/', store_views.SearchProductAPIView.as_view()),

    # Payment endpoints
    path('stripe-checkout/<str:order_id>/', store_views.StripeCheckoutAPIView.as_view()),
    path('payment-success/<str:order_id>/', store_views.PaymentSuccessAPIView.as_view()),

    # Customer endpoints
    path('customer/orders/<int:user_id>/',customer_views.OrdersAPIView.as_view()),
    path('customer/order-details/<int:user_id>/<str:order_id>/', customer_views.OrderDetailsAPIView.as_view()),
    path('customer/wishlist/<int:user_id>/', customer_views.WishlistAPIView.as_view()),
    path('customer/notifications/<int:user_id>/', customer_views.CustomerNotificationAPIView.as_view()),
    path('customer/notification/<int:user_id>/<int:notification_id>/', customer_views.MarkCustomerNotificationAsSeen.as_view()),

    # Vendor endpoints
    path('vendor/stats/<int:vendor_id>/', vendor_views.DashboardStatsAPIView.as_view()),
    path('vendor-orders-chart/<int:vendor_id>/', vendor_views.MonthlyOrderChartAPIView),
    path('vendor-products-chart/<int:vendor_id>/', vendor_views.MonthlyProductChartAPIView),
    path('vendor/products/<int:vendor_id>/', vendor_views.ProductAPIView.as_view()),
    path('vendor/orders/<int:vendor_id>/', vendor_views.OrderAPIView.as_view()),
    path('vendor/orders/<int:vendor_id>/<str:order_id>/', vendor_views.OrderDetailAPIView.as_view()),
    path('vendor/orders/filter/<int:vendor_id>/', vendor_views.FilterOrderAPIView.as_view()),
    path('vendor/revenue/<int:vendor_id>/', vendor_views.RevenueAPIView.as_view()),
    path('vendor/product-filter/<int:vendor_id>/', vendor_views.FilterProductsAPIView.as_view()),
    path('vendor/earning/<int:vendor_id>/', vendor_views.EarningAPIView.as_view()),
    path('vendor/monthly-earning/<int:vendor_id>/', vendor_views.MonthlyEarningTracker),
    path('vendor/reviews/<int:vendor_id>/', vendor_views.ReviewListAPIView.as_view()),
    path('vendor/review-details/<int:vendor_id>/<int:review_id>/', vendor_views.ReviewDetailAPIView.as_view()),
    path('vendor/coupons/<int:vendor_id>/', vendor_views.CouponListAPIView.as_view()),
    path('vendor/coupon-details/<int:vendor_id>/<coupon_id>/', vendor_views.CouponDetailAPIView.as_view()),
    path('vendor/coupon-stats/<int:vendor_id>/', vendor_views.CouponStatsAPIView.as_view()),
    path('vendor/notifications/<int:vendor_id>/', vendor_views.NotificationAPIView.as_view()),
    path('vendor/notification-summary/<int:vendor_id>/', vendor_views.NotificationSummaryAPIView.as_view()),
    path('vendor/notification-marked-as-seen/<int:vendor_id>/<notification_id>/', vendor_views.VendorNotificationMarkedAsSeen.as_view()),
    path('vendor/settings/<int:pk>/', vendor_views.VendorProfileUpdateView.as_view()),
    path('vendor/shop-settings/<int:pk>/', vendor_views.ShopUpdateView.as_view()),
    path('vendor/shop/<slug:vendor_slug>/', vendor_views.ShopAPIView.as_view()),
    path('vendor/shop-products/<slug:vendor_slug>/', vendor_views.ShopProductAPIView.as_view()),
    path('vendor/create-new-product/', vendor_views.ProductCreateView.as_view()),
    path('vendor/update-product/<int:vendor_id>/<str:pid>/', vendor_views.ProductUpdateView.as_view()),
    path('vendor/delete-product/<int:vendor_id>/<str:pid>/', vendor_views.ProductDeleteView.as_view()),
    path('vendor/register/', vendor_views.VendorRegister.as_view()),
]
