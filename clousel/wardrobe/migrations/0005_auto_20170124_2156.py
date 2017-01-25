# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2017-01-24 12:56
from __future__ import unicode_literals

import clothing.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wardrobe', '0004_remove_useritem_last_access'),
    ]

    operations = [
        migrations.AddField(
            model_name='useritem',
            name='image_height',
            field=models.PositiveIntegerField(default=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='useritem',
            name='image_width',
            field=models.PositiveIntegerField(default=100),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='useritem',
            name='image',
            field=models.ImageField(height_field='image_height', upload_to=clothing.models.get_image_upload_to_path, width_field='image_width'),
        ),
    ]
