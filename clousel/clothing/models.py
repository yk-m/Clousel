import logging
from uuid import uuid4

from django.core.exceptions import ValidationError
from django.core.files.storage import FileSystemStorage
from django.db import models
from django.utils.translation import ugettext_lazy as _
from mptt.models import MPTTModel, TreeForeignKey

logger = logging.getLogger('debug')


class Category(MPTTModel):
    name = models.CharField(max_length=255)
    parent = TreeForeignKey(
        'self', null=True, blank=True, related_name='children', db_index=True)

    class Meta:
        verbose_name_plural = 'Categories'

    class MPTTMeta:
        order_insertion_by = ['name']

    def __str__(self):
        return self.name

    def __repr__(self):
        ancestors = self.get_ancestors(include_self=True)
        return self.get_separator().join(node.name for node in ancestors)

    def get_separator(self):
        return '::'


def get_image_upload_to_path(instance, filename):
    return instance.get_image_upload_to_path(filename)


class Clothing(models.Model):
    UPLOAD_TO_DIR = "images/"

    image = models.ImageField(
        upload_to=get_image_upload_to_path,
        null=False,
        blank=False,
    )
    category = TreeForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="%(app_label)s_%(class)s_related",
    )

    class Meta:
        abstract = True

    @classmethod
    def get_image_upload_to_path(cls, filename):
        ext = filename.split('.')[-1]
        return cls.UPLOAD_TO_DIR + '{0}.{1}'.format(uuid4().hex, ext)
