# Generated by Django 5.0 on 2024-03-18 06:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0004_alter_gallery_image'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='gallery',
            name='active',
        ),
    ]
