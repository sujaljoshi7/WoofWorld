# Generated by Django 5.1.6 on 2025-05-08 16:06

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0011_alter_category_created_at_alter_service_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 5, 8, 16, 6, 49, 429187), editable=False),
        ),
        migrations.AlterField(
            model_name='service',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 5, 8, 16, 6, 49, 429478), editable=False),
        ),
    ]
