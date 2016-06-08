from django.db import models
from accounts.models import Customer
from shop.models import Item

class Like(models.Model):
	own = models.ForeignKey(Customer, on_delete=models.CASCADE)
	item = models.ForeignKey(Item, on_delete=models.CASCADE)
	registered = models.DateTimeField(auto_now_add=True)

class PurchasedItem(models.Model):
	own = models.ForeignKey(Customer, on_delete=models.CASCADE)
	item = models.ForeignKey(Item, on_delete=models.CASCADE)
	registered = models.DateTimeField(auto_now_add=True)