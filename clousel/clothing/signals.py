import os

from django.db import models
from django.dispatch import receiver
from django.utils.translation import ugettext_lazy as _


def auto_delete_image_on_delete(sender, instance, **kwargs):
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)


def auto_delete_image_on_change(sender, instance, **kwargs):
    if not instance.pk:
        return False

    try:
        old_image = instance.__class__.objects.get(pk=instance.pk).image
    except instance.__class__.DoesNotExist:
        return False

    new_image = instance.image
    if not old_image == new_image:
        if os.path.isfile(old_image.path):
            os.remove(old_image.path)