# Generated by Django 5.0 on 2024-04-30 12:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vendor', '0007_alter_vendor_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='vendor',
            name='email',
            field=models.CharField(blank=True, help_text='Shop Email', max_length=100, null=True),
        ),
    ]
