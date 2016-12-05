from abc import ABCMeta, abstractmethod

import django_filters
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from mptt.forms import TreeNodeChoiceField
from rest_framework import filters, generics, mixins, viewsets
from rest_framework.decorators import detail_route, list_route
from rest_framework.response import Response

from accounts.models import Profile
from action.models import Like, PurchaseHistory
from clothing.models import Category
from shop.models import Item
from wardrobe.models import UserItem

from .permissions import IsOwner, IsOwnerOrCreateOnly
from .serializer import (BasicUserSerializer, CategorySerializer,
                         FullUserSerializer, ItemSerializer, LikeSerializer,
                         ProfileSerializer, PurchaseHistorySerializer,
                         UserItemSerializer)


class UserViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    permission_classes = (IsOwnerOrCreateOnly, )

    def get_queryset(self):
        """一覧を取得する際に，管理者権限をもつユーザはすべてのユーザの情報を，
        一般ユーザは自分のユーザ情報をそれぞれ返すようフィルタリングしています．"""
        if self.request.user.is_superuser:
            return get_user_model().objects.all()
        else:
            return get_user_model().objects.filter(id=self.request.user.id)

    def get_serializer_class(self):
        """
        管理者権限をもつユーザは詳しいユーザ情報を，
        一般ユーザは限定されたユーザ情報のみを取得するシリアライザを用いるように設定しています．

        具体的にどのような情報を取得できるのかについては，以下を参照してください．

        管理者権限をもつユーザ:
            :class:`api.serializer.FullUserSerializer`
        一般ユーザ:
            :class:`api.serializer.BasicUserSerializer`
        """
        if self.request.user.is_superuser:
            return FullUserSerializer
        else:
            return BasicUserSerializer


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class UserItemViewSet(viewsets.ModelViewSet):
    queryset = UserItem.objects.all()
    serializer_class = UserItemSerializer
    permission_classes = (IsOwner, )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        """一覧を取得する際に，管理者権限をもつユーザはすべてのユーザアイテムの情報を，
        一般ユーザは自分のユーザアイテムのみの情報をそれぞれ返すようフィルタリングしています．"""
        if self.request.user.is_superuser:
            return UserItem.objects.all()
        else:
            return UserItem.objects.filter(owner=self.request.user.id)


class ItemListView(generics.ListAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class CategoryChoiceFilter(django_filters.ModelChoiceFilter):
    field_class = TreeNodeChoiceField

    def filter(self, qs, value):
        """
        カテゴリ検索のためのフィルタです．

        あるカテゴリに含まれるアイテムを検索するとき，
        そのカテゴリに属するアイテムだけでなく，
        その子孫カテゴリに属するアイテムも結果に含むようにしています．
        """
        categories = value.get_descendants(include_self=True)
        return Item.objects.filter(category__in=categories)


class ItemFilter(filters.FilterSet):
    min_price = django_filters.NumberFilter(name="price", lookup_expr='gte')
    max_price = django_filters.NumberFilter(name="price", lookup_expr='lte')
    category = CategoryChoiceFilter(
        queryset=Category.objects.all(),
    )

    class Meta:
        model = Item
        fields = ('category', 'min_price', 'max_price', )


class SearchableItemListView(ItemListView):
    filter_backends = (filters.DjangoFilterBackend,
                       filters.OrderingFilter, filters.SearchFilter, )
    filter_class = ItemFilter
    search_fields = ('brand', 'exhibiter', 'rank', 'size', 'details',
                     'category__name', 'category__parent__name', )
    ordering_fields = ('price', 'updated', )


class AbstractRecommenderList(SearchableItemListView, metaclass=ABCMeta):
    """
    推薦の結果リストを生成するための抽象クラスです．

    :func:`get_pks` で取得するアイテムを決定するので，
    このクラスを継承して推薦するアイテム群のPrimary keyの配列を返す関数を :func:`get_pks` として定義してください．
    """

    def get_queryset(self):
        """ :func:`get_pks` の戻り値でアイテムをフィルタリングします．"""
        user_item = self.get_user_item_object(pk=self.kwargs['pk'])
        pks = self.get_pks(user_item)
        return Item.objects.filter(pk__in=pks)

    def get_user_item_object(self, pk):
        """
        ``wardrobe.models.UserItem`` から引数pkで指定されたアイテムを取得します．

        :raises Model.DoesNotExist: 存在しないユーザアイテムを取得しようとしているとき
        :raises PermissionDenied: 別のユーザのユーザアイテムを取得しようとしているとき
        """
        user_item = get_object_or_404(UserItem, pk=pk)
        if self.request.user != user_item.owner:
            raise PermissionDenied()
        return user_item

    @abstractmethod
    def get_pks(self, user_item):
        pass


class SimilarListView(AbstractRecommenderList):

    def get_pks(self, user_item):
        return [990, 854, 816]


class SuitableListView(AbstractRecommenderList):

    def get_pks(self, user_item):
        return [990, 854, 816]


class ItemDetailView(mixins.RetrieveModelMixin,
                     viewsets.GenericViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

    def detail_handler(self, request, object):
        item = self.get_object()

        if request.method == 'GET':
            response = {'count': object.objects.filter(item=item).count()}

            return Response(response)

        if request.method == 'POST':
            l = object(
                owner=request.user,
                item=item,
            )
            l.save()
            return Response(status=201)

        get_object_or_404(object, owner=request.user, item=item).delete()
        return Response(status=200)

    @detail_route(methods=['get', 'post', 'delete'])
    def like(self, request, pk=None):
        return self.detail_handler(request, Like)

    @detail_route(methods=['get', 'post', 'delete'])
    def purchase(self, request, pk=None):
        return self.detail_handler(request, PurchaseHistory)


class LikeListView(generics.ListAPIView):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer

    def get_queryset(self):
        """ユーザ自身がLikeしたオブジェクトだけになるようフィルタリングしています．"""
        return Like.objects.filter(owner=self.request.user)


class PurchaseHistoryListView(generics.ListAPIView):
    queryset = PurchaseHistory.objects.all()
    serializer_class = PurchaseHistorySerializer

    def get_queryset(self):
        """ユーザ自身が購入済みとしたオブジェクトだけになるようフィルタリングしています．"""
        return PurchaseHistory.objects.filter(owner=self.request.user)
