# Generated by Django 2.2.1 on 2019-05-15 19:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0016_auto_20190515_1916'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='loan_total',
            field=models.DecimalField(decimal_places=2, max_digits=11),
        ),
    ]
