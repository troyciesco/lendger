# Generated by Django 2.2.1 on 2019-06-20 20:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0031_auto_20190612_1634'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='state',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='project',
            name='zipcode',
            field=models.CharField(blank=True, max_length=50),
        ),
    ]
