# Generated by Django 5.0 on 2024-05-02 21:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0027_alter_product_rating_alter_product_views'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='rating',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='product',
            name='views',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
