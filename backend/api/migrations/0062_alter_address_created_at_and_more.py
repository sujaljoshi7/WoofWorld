# Generated by Django 5.1.6 on 2025-04-17 06:56

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0061_alter_address_created_at_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 4, 17, 12, 26, 48, 571027), editable=False),
        ),
        migrations.AlterField(
            model_name='contactform',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 4, 17, 12, 26, 48, 571550), editable=False),
        ),
    ]
