# Generated by Django 2.2.1 on 2019-07-01 15:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contractcalls', '0003_remove_contractinfo_ide'),
    ]

    operations = [
        migrations.AddField(
            model_name='contractinfo',
            name='event_name',
            field=models.CharField(default='', max_length=50),
            preserve_default=False,
        ),
    ]