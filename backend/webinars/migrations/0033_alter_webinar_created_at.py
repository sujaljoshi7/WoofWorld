# Generated by Django 5.1.6 on 2025-04-07 08:16

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webinars', '0032_alter_webinar_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='webinar',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 4, 7, 13, 46, 6, 306266), editable=False),
        ),
    ]
