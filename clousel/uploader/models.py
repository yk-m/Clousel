from django.db import models
from accounts.models import Customer
from shop.models import Category

class UserImage(models.Model):
	own = models.ForeignKey(Customer, on_delete=models.CASCADE)
	image = models.ImageField()
	category = models.ManyToManyField(Category)
	has_bought = models.BooleanField()

	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)

