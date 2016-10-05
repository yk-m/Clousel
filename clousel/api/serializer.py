from django.contrib.auth import get_user_model
from rest_framework import serializers

from accounts.models import Profile
from action.models import Like, PurchaseHistory
from clothing.models import Category, Clothing
from shop.models import Item
from uploader.models import UserImage


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
        read_only_fields = ('pk', 'is_active', 'is_admin',
                            'last_login', 'date_joined', )
        extra_kwargs = {'password': {'write_only': True}}


class CategorySerializer(serializers.ModelSerializer):
    tree = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('tree', )

    def get_tree(self, obj):
        tree = obj._recurse_for_parents(obj)
        tree.append(obj.title)
        return tree


class ClothingSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    orientation = serializers.SerializerMethodField()

    class Meta:
        model = Clothing
        fields = ('pk', 'image', 'orientation', 'category', )
        read_only_fields = ('pk', )

    def get_orientation(self, obj):
        if (obj.image.height < obj.image.width):
            return 'landscape'
        if (obj.image.height > obj.image.width):
            return 'portrait'
        return 'square'


class ItemSerializer(ClothingSerializer):

    class Meta:
        model = Item
        fields = ('pk', 'image', 'orientation', 'category', 'price', 'brand', 'exhibiter',
                  'delivery_days', 'delivery_service', 'delivery_source',
                  'rank', 'size', 'image_url', 'page_url', 'details',
                  'created', 'updated', )
        read_only_fields = ('pk', 'created', 'updated', )


class UserImageSerializer(ClothingSerializer):

    class Meta:
        model = UserImage
        fields = ('pk', 'owner', 'image', 'orientation', 'category', 'has_bought',
                  'created', 'updated', )
        read_only_fields = ('pk', 'owner', 'created', 'updated', )


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
