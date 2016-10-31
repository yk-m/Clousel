from django.contrib.auth import get_user_model
from rest_framework import serializers

from accounts.models import Profile
from action.models import Like, PurchaseHistory
from clothing.models import Category, Clothing
from shop.models import Item
from wardrobe.models import UserItem


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ('name', 'date_of_birth', )


class BasicUserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = get_user_model()
        fields = ('pk', 'email', 'password', 'profile', )
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        user = self.Meta.model(
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])
        user.save()
        Profile.objects.create(user=user, **profile_data)

        return user


class FullUserSerializer(BasicUserSerializer):

    class Meta:
        model = get_user_model()
        fields = ('pk', 'email', 'password', 'profile',
                  'is_admin', 'last_login', 'date_joined', )
        read_only_fields = ('pk', 'last_login', 'date_joined', )
        extra_kwargs = {'password': {'write_only': True}}


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ('pk', 'name', 'level', )


class ClothingSerializer(serializers.ModelSerializer):
    category_meta = serializers.SerializerMethodField()
    # orientation = serializers.SerializerMethodField()

    class Meta:
        model = Clothing
        fields = ('pk', 'image', 'orientation', 'category', 'category_meta', )

    def get_category_meta(self, obj):
        ancestors = obj.category.get_ancestors(
            ascending=False, include_self=True)
        return [node.name for node in ancestors]


class ItemSerializer(ClothingSerializer):
    likes = serializers.SerializerMethodField()
    purchases = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_purchased = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = ('pk', 'image', 'orientation', 'category', 'category_meta',
                  'price', 'brand', 'exhibiter',
                  'delivery_days', 'delivery_service', 'delivery_source',
                  'rank', 'size', 'image_url', 'page_url', 'details',
                  'created', 'updated',
                  'likes', 'purchases', 'is_liked', 'is_purchased', )
        read_only_fields = ('created', 'updated', )

    def get_likes(self, obj):
        return Like.objects.filter(item=obj).count()

    def get_purchases(self, obj):
        return PurchaseHistory.objects.filter(item=obj).count()

    def get_is_liked(self, obj):
        return Like.objects.filter(owner=self.context['request'].user, item=obj).exists()

    def get_is_purchased(self, obj):
        return PurchaseHistory.objects.filter(owner=self.context['request'].user, item=obj).exists()


class UserItemSerializer(ClothingSerializer):

    class Meta:
        model = UserItem
        fields = ('pk', 'owner', 'image', 'orientation', 'category', 'category_meta',
                  'has_bought', 'created', 'updated', )
        read_only_fields = ('owner', 'created', 'updated', )


class LikeSerializer(serializers.ModelSerializer):
    item = ItemSerializer()

    class Meta:
        model = Like
        fields = ('item', )


class PurchaseHistorySerializer(serializers.ModelSerializer):
    item = ItemSerializer()

    class Meta:
        model = PurchaseHistory
        fields = ('item', )
