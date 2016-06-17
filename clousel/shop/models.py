from django.db import models
from django.db.models.signals import pre_delete
from django.dispatch.dispatcher import receiver

from clothing.models import Clothing


class Item(Clothing):
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
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'shop items'
        ordering = ['category']

    def __str__(self):
        return str(self.category)

    def get_image_upload_to_path(instance, filename):
        return 'shop_item/images/' + filename

    def get_binary_image_upload_to_path(instance, filename):
        return 'shop_item/binary_images/' + filename
