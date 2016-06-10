from django.db import models
from django.contrib.auth.models import User as BaseUser

class User(models.Model):
	user = models.OneToOneField(BaseUser, on_delete=models.CASCADE)
	MALE = 'M'
	FEMALE = 'F'
	OTHER = 'O'
	GENDER_CHOICES = (
		(MALE, 'Male'),
		(FEMALE, 'Female'),
		(OTHER, 'Other'),
	)
	gender = models.CharField(
		max_length = 1,
		choices = GENDER_CHOICES,
	)

	class Meta:
		verbose_name_plural = 'users'
