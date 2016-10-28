from django.contrib import admin

from .models import UserItem


@admin.register(UserItem)
class UserItem(admin.ModelAdmin):
    pass
