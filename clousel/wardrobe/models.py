from django.conf import settings
from django.db import models
from django.dispatch.dispatcher import receiver
from django.utils.translation import ugettext_lazy as _

import clothing.signals
from clothing.models import Clothing


class UserItem(Clothing):
    UPLOAD_TO_DIR = 'user/images/'

    owner = models.ForeignKey(settings.AUTH_USER_MODEL,
                              on_delete=models.CASCADE)
    title = models.CharField(max_length=255, default=_("No title"))
    has_bought = models.BooleanField()

    class Meta:
        verbose_name_plural = 'user items'


@receiver(models.signals.post_delete, sender=UserItem)
def auto_delete_image_on_delete(sender, instance, **kwargs):
    clothing.signals.auto_delete_image_on_delete(sender, instance, **kwargs)


@receiver(models.signals.pre_save, sender=UserItem)
def auto_delete_image_on_change(sender, instance, **kwargs):
    clothing.signals.auto_delete_image_on_change(sender, instance, **kwargs)
