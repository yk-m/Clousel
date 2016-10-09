from uuid import uuid4

from django.conf import settings
from django.db import models
from django.db.models.signals import pre_delete
from django.dispatch.dispatcher import receiver

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
