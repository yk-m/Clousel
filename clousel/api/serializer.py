from django.conf import settings
from rest_framework import serializers

from shop.models import Item


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = settings.AUTH_USER_MODEL
        fields = ('username', 'email', 'first_name', 'last_name')


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = (
            'image',
            'category',
            'price',
            'brand',
            'exhibiter',
            'delivery_days',
            'delivery_service',
            'delivery_source',
            'rank',
            'size',
            'image_url',
            'page_url',
            'details',
            'created',
            'updated',
        )
