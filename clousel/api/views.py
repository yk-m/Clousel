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
from uploader.models import UserImage

from .permissions import IsOwner
from .serializer import (BasicUserSerializer, CategorySerializer,
                         FullUserSerializer, ItemSerializer, LikeSerializer,
                         ProfileSerializer, PurchaseHistorySerializer,
                         UserImageSerializer)


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class LikeListView(generics.ListAPIView):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer

    def get_queryset(self):
        return Like.objects.filter(owner=self.request.user)


class PurchaseHistoryListView(generics.ListAPIView):
    queryset = PurchaseHistory.objects.all()
    serializer_class = PurchaseHistorySerializer

    def get_queryset(self):
        return PurchaseHistory.objects.filter(owner=self.request.user)


class ItemListView(generics.ListAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


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


class CategoryChoiceFilter(django_filters.ModelChoiceFilter):
    field_class = TreeNodeChoiceField

    def filter(self, qs, value):
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
    ordering_fields = ('price', )

    def get_queryset(self):
        return Item.objects.all()

    # def get_search_results(self, request, queryset, search_term):
    #     logger.error(self)
    # return super(PersonAdmin, self).get_search_results(request, queryset,
    # search_term)


class RecommenderListView(SearchableItemListView, metaclass=ABCMeta):

    def get_queryset(self):
        userimage = self.get_userimage_object(pk=self.kwargs['pk'])
        return Item.objects.filter(image__in=self.get_paths())

    def get_userimage_object(self, pk):
        userimage = get_object_or_404(UserImage, pk=self.kwargs['pk'])
        if self.request.user != userimage.owner:
            raise PermissionDenied()
        return userimage

    @abstractmethod
    def get_paths():
        pass


class SimilarListView(SearchableItemListView):

    def get_paths(self):
        return [
            'shop_item/images/d2040ebda6491a956be6bb1cd3ee0dbe2a8757d5_C8FWZ4N.jpg',  # 98
            'shop_item/images/ba0d45347428fcc5c133cfb8bdb5df82e50355f5_q5mqoOF.jpg',  # 6
            'shop_item/images/300404cfea1bf29778964e496b534555627ac58f_jKI1Nw5.jpg',  # 16
        ]


class SuitableListView(SearchableItemListView):

    def get_paths(self):
        return [
            'shop_item/images/d2040ebda6491a956be6bb1cd3ee0dbe2a8757d5_C8FWZ4N.jpg',  # 98
            'shop_item/images/ba0d45347428fcc5c133cfb8bdb5df82e50355f5_q5mqoOF.jpg',  # 6
            'shop_item/images/300404cfea1bf29778964e496b534555627ac58f_jKI1Nw5.jpg',  # 16
        ]


class UserViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()

    def get_queryset(self):
        if self.request.user.is_superuser:
            return get_user_model().objects.all()
        else:
            return get_user_model().objects.filter(id=self.request.user.id)

    def get_serializer_class(self):
        if self.request.user.is_superuser:
            return FullUserSerializer
        else:
            return BasicUserSerializer


class UserImageViewSet(viewsets.ModelViewSet):
    queryset = UserImage.objects.all()
    serializer_class = UserImageSerializer
    permission_classes = (IsOwner, )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        if self.request.user.is_superuser:
            return UserImage.objects.all()
        else:
            return UserImage.objects.filter(owner=self.request.user)

    # def get_serializer_for_search(self, queryset, request):
    # return ItemSerializer(queryset, many=True, context={'request': request})

    # def get_queryset_for_search(self, paths):
    #     return Item.objects.filter(image__in=paths)
