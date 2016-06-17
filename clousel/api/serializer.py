from django.contrib.auth import get_user_model
from rest_framework import serializers

from shop.models import Item


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
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
