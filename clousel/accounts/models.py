from django.db import models
from django.contrib.auth.models import User

GENDER_CHOICES = (
	('M', 'Male'),
	('F', 'Female'),
	('O', 'Other'),
)

class Customer(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	gender = models.CharField(
		max_length = 1,
		choices = GENDER_CHOICES,
	)

