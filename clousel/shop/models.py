from uuid import uuid4

from django.db import models
from django.db.models.signals import pre_delete
from django.dispatch.dispatcher import receiver

import clothing.signals
from clothing.models import Clothing


class Item(Clothing):
    UPLOAD_TO_DIR = 'shop_item/images/'

    price = models.PositiveIntegerField()
    brand = models.CharField(max_length=255, blank=True)
    exhibiter = models.CharField(max_length=255, blank=True)
    delivery_days = models.CharField(max_length=255, blank=True)
    delivery_service = models.CharField(max_length=255, blank=True)
    delivery_source = models.CharField(max_length=255, blank=True)
    rank = models.CharField(max_length=255, blank=True)
    size = models.CharField(max_length=255, blank=True)
    image_url = models.URLField()
    page_url = models.URLField()
    details = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = 'shop items'
        ordering = ['category']

    def __str__(self):
        return str(self.category)


@receiver(models.signals.post_delete, sender=Item)
def auto_delete_image_on_delete(sender, instance, **kwargs):
    clothing.signals.auto_delete_image_on_delete(sender, instance, **kwargs)


@receiver(models.signals.pre_save, sender=Item)
def auto_delete_image_on_change(sender, instance, **kwargs):
    clothing.signals.auto_delete_image_on_change(sender, instance, **kwargs)

