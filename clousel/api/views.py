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


class ItemListView(generics.ListAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class SearchableItemListView(ItemListView):
    filter_backends = (filters.DjangoFilterBackend,
                       filters.OrderingFilter, filters.SearchFilter, )
    filter_class = ItemFilter
    search_fields = ('brand', 'exhibiter', 'rank', 'size', 'details',
                     'category__name', 'category__parent__name', )
    ordering_fields = ('price', )


class AbstractRecommenderList(SearchableItemListView, metaclass=ABCMeta):

    def get_queryset(self):
        userimage = self.get_userimage_object(pk=self.kwargs['pk'])
        paths = [Item.get_image_upload_to_path(filename) for filename in self.get_filenames()]
        return Item.objects.filter(image__in=paths)

    def get_userimage_object(self, pk):
        userimage = get_object_or_404(UserImage, pk=pk)
        if self.request.user != userimage.owner:
            raise PermissionDenied()
        return userimage

    @abstractmethod
    def get_filenames():
        pass


class SimilarListView(AbstractRecommenderList):

    def get_filenames(self):
        return [
            'b4990a379fee25115c6a10a6cfd79627c96ab4f1_sISa2DL.jpg',  # 1
            '4a8e1fa6c819443c8e418e1a4b3fba3da791c844_EmokCFy.jpg',  # 13
            '0f53d47bfa9550b56e38fbcb4e89f6a408b41ecf.jpg',  # 159
        ]


class SuitableListView(AbstractRecommenderList):

    def get_filenames(self):
        return [
            '5dc665ec432df2f2a8b3ee88542a71037fd009a9_WKGyGVf.jpg',  # 92
            '6bb28b025aeaabe67753067fcd15894c914d7b37_SmtY9z7.jpg',  # 88
            '7e0278d6b9606d7a0b3e368c66c76c08bb800fdc.jpg',  # 172
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
