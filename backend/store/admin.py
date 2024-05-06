from django.contrib import admin
from store.models import Category, Tax, Product, Specification, Size, Color, Gallery, Cart, CartOrder, CartOrderItem, Reviews, ProductFAQ, Wishlist, Notification, Coupon

class GalleryInline(admin.TabularInline):
    model = Gallery
    extra = 0

class SpecificationInline(admin.TabularInline):
    model = Specification
    extra = 0

class SizeInline(admin.TabularInline):
    model = Size
    extra = 0

class ColorInline(admin.TabularInline):
    model = Color
    extra = 0

class ProductAdmin(admin.ModelAdmin):
    list_display = ['title', 'price', 'shipping_cost', 'stock_qty', 'in_stock', 'vendor', 'featured']
    list_editable = ['featured']
    list_filter = ['date']
    search_fields = ['title']
    inlines = [GalleryInline, SpecificationInline, SizeInline, ColorInline]


class CartAdmin(admin.ModelAdmin):
    list_display =  ['product', 'cart_id', 'quantity', 'price', 'sub_total' , 'shipping_cost', 'service_fee', 'tax_fee', 'total', 'country', 'size', 'color', 'date']

class CartOrderAdmin(admin.ModelAdmin):
    list_display =  ['order_id', 'buyer', 'payment_status', 'total', 'saved', 'date']
    search_fields = ['order_id', 'full_name', 'email', 'mobile']
    list_filter = ['payment_status', 'order_status']

class CartOrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'ord_id', 'quantity', 'total', 'vendor']

class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'product']

class ProductFAQAdmin(admin.ModelAdmin):
    list_display = ['user', 'product']

class WishlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'product']

class NotificationAdmin(admin.ModelAdmin):
    list_display = ['order']

class CouponAdmin(admin.ModelAdmin):
    list_display = ['vendor', 'code']

admin.site.register(Category)
admin.site.register(Product, ProductAdmin)
admin.site.register(Specification)
admin.site.register(Size)
admin.site.register(Color)
admin.site.register(Gallery)
admin.site.register(Cart, CartAdmin)
admin.site.register(CartOrder, CartOrderAdmin)
admin.site.register(CartOrderItem, CartOrderItemAdmin)
admin.site.register(Reviews, ReviewAdmin)
admin.site.register(Wishlist, WishlistAdmin)
admin.site.register(Notification, NotificationAdmin)
admin.site.register(ProductFAQ, ProductFAQAdmin)
admin.site.register(Coupon, CouponAdmin)
admin.site.register(Tax)
