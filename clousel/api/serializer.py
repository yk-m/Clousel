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
    category = serializers.SerializerMethodField()

    class Meta:
        model = Clothing
        fields = ('pk', 'image', 'orientation', 'category', )

    def get_category(self, obj):
        return repr(obj.category)


class UserItemSerializer(ClothingSerializer):

    class Meta:
        model = UserItem
        fields = ('pk', 'owner', 'title', 'image', 'orientation', 'category',
                  'has_bought', 'created', 'updated', )
        read_only_fields = ('owner', 'created', 'updated', )


class ItemSerializer(ClothingSerializer):
    likes = serializers.SerializerMethodField()
    purchases = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_purchased = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = ('pk', 'image', 'orientation', 'category',
                  'price', 'brand', 'exhibiter',
                  'delivery_days', 'delivery_service', 'delivery_source',
                  'rank', 'size', 'image_url', 'page_url', 'details',
                  'created', 'updated',
                  'likes', 'purchases', 'is_liked', 'is_purchased', )
        read_only_fields = ('created', 'updated', )

    def get_likes(self, obj):
        """
        何人のユーザが指定されたアイテムをLikeしているかカウントします．

        :param obj: ``shop.models.Item`` のインスタンス
        :return: 指定されたアイテムをLikeしているユーザの数
        """
        return Like.objects.filter(item=obj).count()

    def get_purchases(self, obj):
        """
        何人のユーザが指定されたアイテムを購入済みかカウントします．

        :param obj: ``shop.models.Item`` のインスタンス
        :return: 指定されたアイテムを購入済みのユーザの数
        """
        return PurchaseHistory.objects.filter(item=obj).count()

    def get_is_liked(self, obj):
        """
        ユーザ自身が引数で指定されたアイテムをLikeしているか判定します．

        :param obj: ``shop.models.Item`` のインスタンス
        :return: Boolean
        """
        return Like.objects.filter(owner=self.context['request'].user, item=obj).exists()

    def get_is_purchased(self, obj):
        """
        ユーザ自身が引数で指定されたアイテムを購入済みか判定します．

        :param obj: ``shop.models.Item`` のインスタンス
        :return: Boolean
        """
        return PurchaseHistory.objects.filter(owner=self.context['request'].user, item=obj).exists()


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
