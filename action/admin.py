from django.contrib import admin

from .models import Like, PurchaseHistory


@admin.register(Like)
class Like(admin.ModelAdmin):
    pass


@admin.register(PurchaseHistory)
class PurchaseHistory(admin.ModelAdmin):
    pass
