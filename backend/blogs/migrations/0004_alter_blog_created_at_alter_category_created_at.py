# Generated by Django 5.1.6 on 2025-03-29 08:49

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blogs', '0003_alter_blog_created_at_alter_category_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blog',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 3, 29, 14, 19, 23, 202239), editable=False),
        ),
        migrations.AlterField(
            model_name='category',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 3, 29, 14, 19, 23, 201681), editable=False),
        ),
    ]
