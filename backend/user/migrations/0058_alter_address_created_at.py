# Generated by Django 5.1.6 on 2025-05-08 16:06

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0057_alter_address_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 5, 8, 16, 6, 49, 423372), editable=False),
        ),
    ]
