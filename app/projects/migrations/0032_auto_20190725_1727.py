# Generated by Django 2.2.1 on 2019-07-25 21:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0031_auto_20190612_1634'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='ARV',
            field=models.PositiveIntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='project',
            name='grade',
            field=models.CharField(default='A', max_length=50),
            preserve_default=False,
        ),
    ]