# Generated by Django 2.2.1 on 2019-07-01 20:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contractcalls', '0005_contractinfo_block_numb'),
    ]

    operations = [
        migrations.CreateModel(
            name='EventBlock',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('current_block', models.IntegerField()),
                ('event_name', models.CharField(max_length=50)),
                ('past_block', models.IntegerField()),
            ],
        ),
        migrations.DeleteModel(
            name='ContractInfo',
        ),
    ]
