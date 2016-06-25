from django.contrib.auth import get_user_model
from rest_framework import serializers

from accounts.models import Profile
from shop.models import Item


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ('name', 'birthday')


class BasicUserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = get_user_model()
        fields = ('pk', 'username', 'email', 'password', 'profile')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        user = self.Meta.model(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])
        user.save()
        Profile.objects.create(user=user, **profile_data)
        return user


class FullUserSerializer(BasicUserSerializer):

    class Meta:
        model = get_user_model()
        fields = ('pk', 'username', 'email', 'password', 'profile',
                  'groups', 'user_permissions', 'is_staff', 'is_active', 'is_superuser',
                  'last_login', 'date_joined')
        read_only_fields = ('groups', 'user_permissions', 'is_staff', 'is_active', 'is_superuser',
                            'last_login', 'date_joined')
        extra_kwargs = {'password': {'write_only': True}}


class ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = ('image', 'category', 'price', 'brand', 'exhibiter',
                  'delivery_days', 'delivery_service', 'delivery_source',
                  'rank', 'size', 'image_url', 'page_url', 'details',
                  'created', 'updated', )
