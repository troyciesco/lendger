# Generated by Django 2.2.1 on 2019-06-07 17:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_auto_20190607_1324'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='wallet_address',
            field=models.CharField(blank=True, max_length=50),
        ),
    ]