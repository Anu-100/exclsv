# Generated by Django 5.0 on 2024-04-04 11:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0013_alter_cartorderitem_vendor'),
    ]

    operations = [
        migrations.AddField(
            model_name='cartorderitem',
            name='coupon',
            field=models.ManyToManyField(blank=True, to='store.coupon'),
        ),
    ]
