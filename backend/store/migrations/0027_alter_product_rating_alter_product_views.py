# Generated by Django 5.0 on 2024-05-02 21:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0026_alter_product_rating'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='rating',
            field=models.PositiveIntegerField(blank=True, default=0, null=True),
        ),
        migrations.AlterField(
            model_name='product',
            name='views',
            field=models.PositiveIntegerField(blank=True, default=0, null=True),
        ),
    ]
