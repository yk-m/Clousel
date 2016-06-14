# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-06-11 05:14
from __future__ import unicode_literals

import clothing.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('clothing', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to=clothing.models.get_image_upload_to_path)),
                ('binary_image', models.FileField(upload_to=clothing.models.get_binary_image_upload_to_path)),
                ('has_bought', models.BooleanField()),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='uploader_userimage_related', to='clothing.Category')),
                ('own', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'user images',
            },
        ),
    ]