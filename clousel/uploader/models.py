from django.db import models
from accounts.models import User
from shop.models import Category

def customer_directory_path(instance, filename):
	return 'customer_{0}/{1}'.format(instance.own.id, filename)

class UserImage(models.Model):
	own = models.ForeignKey(User, on_delete=models.CASCADE)
	image = models.ImageField()
	category = models.ManyToManyField(Category)
	has_bought = models.BooleanField()
	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)

	class Meta:
		verbose_name_plural = 'user images'


