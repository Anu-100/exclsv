# Generated by Django 5.0 on 2024-03-22 16:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0011_alter_tax_options'),
    ]

    operations = [
        migrations.RenameField(
            model_name='cart',
            old_name='shipping_amount',
            new_name='shipping_cost',
        ),
        migrations.RenameField(
            model_name='cartorder',
            old_name='shipping_amount',
            new_name='shipping_cost',
        ),
        migrations.RenameField(
            model_name='cartorderitem',
            old_name='shipping_amount',
            new_name='shipping_cost',
        ),
    ]
