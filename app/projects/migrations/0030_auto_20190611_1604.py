# Generated by Django 2.2.1 on 2019-06-11 20:04

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('projects', '0029_auto_20190607_1338'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='QandA',
            new_name='Inquiry',
        ),
    ]