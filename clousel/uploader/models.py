from uuid import uuid4

from django.conf import settings
from django.db import models
from django.dispatch.dispatcher import receiver

import clothing.signals
from clothing.models import Clothing


class UserImage(Clothing):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL,
                              on_delete=models.CASCADE)
    has_bought = models.BooleanField()
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'user images'

    def get_image_upload_to_path(self, filename):
        ext = filename.split('.')[-1]
        return 'user/images/{0}/{1}.{2}'.format(self.owner.id, uuid4().hex, ext)


@receiver(models.signals.post_delete, sender=UserImage)
def auto_delete_image_on_delete(sender, instance, **kwargs):
    clothing.signals.auto_delete_image_on_delete(sender, instance, **kwargs)


@receiver(models.signals.pre_save, sender=UserImage)
def auto_delete_image_on_change(sender, instance, **kwargs):
    clothing.signals.auto_delete_image_on_change(sender, instance, **kwargs)
