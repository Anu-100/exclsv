# Generated by Django 5.0 on 2024-03-17 08:01

import shortuuid.django_fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gallery',
            name='gallery_id',
            field=shortuuid.django_fields.ShortUUIDField(alphabet='abcdefghijklmnopqrstuvwxyz', length=10, max_length=10, prefix=''),
        ),
        migrations.AlterField(
            model_name='gallery',
            name='slug',
            field=models.SlugField(),
        ),
    ]
