from django.contrib import admin

from .models import UserImage


@admin.register(UserImage)
class UserImage(admin.ModelAdmin):
    pass
