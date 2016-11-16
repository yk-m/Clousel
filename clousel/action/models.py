from django.conf import settings
from django.db import models
from django.utils import timezone

from shop.models import Item


class UserOwned(models.Model):
    """
    ユーザの ``shop.models.Item`` に関する情報を保持できるようにする抽象クラスです．

    例えば，継承して ``comment`` フィールドを追加すれば，
    ``shop.models.Item`` のあるアイテムに対するユーザのコメントを保持するモデルができます．
    """

    owner = models.ForeignKey(settings.AUTH_USER_MODEL,
                              on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    registered = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ("own", "item")
        abstract = True

    def save(self, *args, **kwargs):
        # あるユーザが同じアイテムについての情報を重複して登録できないように
        try:
            i = self.__class__.objects.get(owner=self.owner, item=self.item)
            i.registered = timezone.now()
            i.save()
        except self.__class__.DoesNotExist:
            super(UserOwned, self).save(*args, **kwargs)


class Like(UserOwned):

    class Meta:
        verbose_name_plural = 'likes'


class PurchaseHistory(UserOwned):

    class Meta:
        verbose_name_plural = 'purchase history'
