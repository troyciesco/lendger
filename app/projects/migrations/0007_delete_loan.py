# Generated by Django 2.2.1 on 2019-05-03 19:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0006_remove_loan_loan_amount'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Loan',
        ),
    ]
