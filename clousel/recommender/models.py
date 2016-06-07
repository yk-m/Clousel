from django.db import models
from accounts.models import Customer

class ClothingCategory(models.Model):
	name = models.CharField(max_length=255)

class Uploads(models.Model):
	own = models.ForeignKey(Customer, on_delete=models.CASCADE)
	category = models.ManyToManyField(ClothingCategory)
	image = models.ImageField()

class Item(models.Model):
	image = models.ImageField()

	category = models.ManyToManyField(ClothingCategory)
	price = models.PositiveIntegerField()
	size = models.CharField(max_length=127)
	brand = models.CharField(max_length=255)
	rank = models.CharField(max_length=127)

	page_url = models.URLField()
	image_url = models.URLField()

	details = models.TextField()

	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True,auto_now_add=True)

class Like(models.Model):
	own = models.ForeignKey(Customer, on_delete=models.CASCADE)
	item = models.ForeignKey(Item, on_delete=models.CASCADE)
	registered = models.DateTimeField(auto_now=True,auto_now_add=True)

class PurchasedItem(models.Model):
	own = models.ForeignKey(Customer, on_delete=models.CASCADE)
	item = models.ForeignKey(Item, on_delete=models.CASCADE)
	registered = models.DateTimeField(auto_now=True,auto_now_add=True)