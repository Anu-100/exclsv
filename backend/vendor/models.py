from django.db import models
from django.utils.text import slugify
from userauth.models import User


class Vendor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.FileField(upload_to="vendor",null=True, blank=True, default="default/default-user.jpg")
    name = models.CharField(max_length=100, null=True, blank=True, help_text="Shop Name")
    email = models.CharField(max_length=100, null=True, blank=True, help_text="Shop Email")
    description = models.TextField(blank=True, null=True)
    mobile = models.CharField(max_length=100, blank=True, null=True)
    active = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)
    slug = models.SlugField(unique=True, max_length=500)

    class Meta:
        verbose_name_plural = "Vendors"
        ordering = ["-date"]

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if self.slug == "" or self.slug == None:
            self.slug = slugify(self.name)
        
        super(Vendor, self).save(*args, **kwargs)
