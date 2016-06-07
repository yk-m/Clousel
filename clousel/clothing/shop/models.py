from django.db import models
from clothing.models import Category

class Item(models.Model):
	image = models.ImageField()

	category = models.ManyToManyField(Category)
	price = models.PositiveIntegerField()
	size = models.CharField(max_length=127)
	brand = models.CharField(max_length=255)
	rank = models.CharField(max_length=127)

	page_url = models.URLField()
	image_url = models.URLField()

	details = models.TextField()

	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)
