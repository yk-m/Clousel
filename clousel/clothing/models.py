import os
from uuid import uuid4

from django.core.exceptions import ValidationError
from django.core.files.storage import FileSystemStorage
from django.db import models
from django.utils.functional import cached_property
from django.utils.translation import ugettext_lazy as _
from mptt.models import MPTTModel, TreeForeignKey


class Category(MPTTModel):
    """
    カテゴリ情報を保持するためのモデルです．

    `django-mptt <https://github.com/django-mptt/django-mptt>`_ を利用し，
    親子関係について `入れ子集合モデル <http://www.geocities.jp/mickindex/database/db_tree_ns.html>`_ を用いて
    管理しています．
    """

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
        return ' > '


def get_image_upload_to_path(instance, filename):
    return instance.get_image_upload_to_path(filename)


class Clothing(models.Model):
    """
    アイテム情報を保持できるようにする抽象クラスです．

    ``UPLOAD_TO_DIR`` を上書きすることでimageの保存先ディレクトリを変更できます．

    また， :func:`get_image_upload_to_path` をオーバーライドするとパス指定方法ごと変更することができます．
    """

    UPLOAD_TO_DIR = "images/"
    ORIENTATION = ('landscape', 'portrait', 'square')

    image_width = models.PositiveIntegerField()
    image_height = models.PositiveIntegerField()
    image = models.ImageField(
        upload_to=get_image_upload_to_path,
        null=False,
        blank=False,
        width_field='image_width', height_field='image_height'
    )
    category = TreeForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="%(app_label)s_%(class)s_related",
    )
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    @classmethod
    def get_image_upload_to_path(cls, filename):
        """ ``UPLOAD_TO_DIR/{uuid}.ext`` の形式でファイルを保存します． """
        ext = filename.split('.')[-1]
        return cls.UPLOAD_TO_DIR + '{0}.{1}'.format(uuid4().hex, ext)

    @cached_property
    def orientation(self):
        if (self.image_height < self.image_width):
            return Clothing.ORIENTATION[0]
        if (self.image_height > self.image_width):
            return Clothing.ORIENTATION[1]
        return Clothing.ORIENTATION[2]

    @cached_property
    def is_square_image(self):
        if (self.orientation == Clothing.ORIENTATION[2]):
            return True
        return False


def auto_delete_image_on_delete(sender, instance, **kwargs):
    """Clothingのサブクラスにおいて，レコード削除時にimageファイルも削除したいときは，
    この関数を ``django.db.models.signals.post_delete`` 通知時に実行するよう設定してください．"""

    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)


def auto_delete_image_on_change(sender, instance, **kwargs):
    """Clothingのサブクラスにおいて，レコード内容変更時にimageファイルも削除したいときは，
    この関数を ``django.db.models.signals.pre_save`` 通知時に実行するよう設定してください．"""
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
