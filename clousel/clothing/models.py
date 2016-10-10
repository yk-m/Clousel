from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _
from mptt.models import MPTTModel, TreeForeignKey


class Category(MPTTModel):
    name = models.CharField(max_length=255)
    parent = TreeForeignKey(
        'self', null=True, blank=True, related_name='children', db_index=True)

    class Meta:
        verbose_name_plural = 'Categories'

    class MPTTMeta:
        order_insertion_by = ['name']

    def __str__(self):
        ancestors = self.get_ancestors(include_self=True)
        return self.get_separator().join(node.name for node in ancestors)

    def get_separator(self):
        return '::'


def get_image_upload_to_path(instance, filename):
    return instance.get_image_upload_to_path(filename)


class Clothing(models.Model):
    image = models.ImageField(upload_to=get_image_upload_to_path)
    category = TreeForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="%(app_label)s_%(class)s_related",
    )

    class Meta:
        abstract = True

    @staticmethod
    def get_image_upload_to_path(filename):
        return 'images/' + filename

    def delete(self, *args, **kwargs):
        self.image.delete(False)
        super(Clothing, self).delete(*args, **kwargs)
