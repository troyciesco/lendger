# Generated by Django 2.2.1 on 2019-05-31 15:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='wallet_address',
            field=models.CharField(default='', max_length=50),
        ),
    ]