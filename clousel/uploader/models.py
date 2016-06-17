from django.conf import settings
from django.db import models
from django.db.models.signals import pre_delete
from django.dispatch.dispatcher import receiver

from clothing.models import Clothing


class UserImage(Clothing):
    own = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    has_bought = models.BooleanField()
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'user images'

    def get_image_upload_to_path(instance, filename):
        return 'user/images/{0}/{1}'.format(instance.own.id, filename)

    def get_binary_image_upload_to_path(instance, filename):
        return 'user/binary_images/{0}/{1}'.format(instance.own.id, filename)

