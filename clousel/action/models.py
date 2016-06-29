from django.conf import settings
from django.db import models

from shop.models import Item


class UserOwned(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL,
                              on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    registered = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("own", "item")
        abstract = True

    def save(self, *args, **kwargs):
        try:
            i = self.__class__.objects.get(owner=self.owner, item=self.item)
        except self.__class__.DoesNotExist:
            super(UserOwned, self).save(*args, **kwargs)


class Like(UserOwned):

    class Meta:
        verbose_name_plural = 'likes'


class PurchaseHistory(UserOwned):

    class Meta:
        verbose_name_plural = 'purchase history'
