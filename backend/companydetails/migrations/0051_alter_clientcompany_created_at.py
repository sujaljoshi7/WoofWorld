# Generated by Django 5.1.6 on 2025-04-14 07:12

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('companydetails', '0050_alter_clientcompany_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clientcompany',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 4, 14, 12, 41, 56, 216239), editable=False),
        ),
    ]
