from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

# from .models import Profile, Rider, Shop


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


# @receiver(post_save, sender=Profile)
# def create_sub_profile(sender, instance=None, created=False, **kwargs):
#     if not created:
#         return

#     if instance.is_shop:
#         Shop(profile=instance)

#     Rider(profile=instance)

