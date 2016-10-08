from django.contrib import admin

from .models import Category


@admin.register(Category)
class Category(admin.ModelAdmin):
    list_display = ('title', '_parents_repr')
    search_fields = ['title']
