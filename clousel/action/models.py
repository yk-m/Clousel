from django.db import models
from accounts.models import User
from shop.models import Item

class Like(models.Model):
	own = models.ForeignKey(User, on_delete=models.CASCADE)
	item = models.ForeignKey(Item, on_delete=models.CASCADE)
	registered = models.DateTimeField(auto_now_add=True)

	class Meta:
		verbose_name_plural = 'likes'

class PurchaseHistory(models.Model):
	own = models.ForeignKey(User, on_delete=models.CASCADE)
	item = models.ForeignKey(Item, on_delete=models.CASCADE)
	registered = models.DateTimeField(auto_now_add=True)

	class Meta:
		verbose_name_plural = 'purchase history'