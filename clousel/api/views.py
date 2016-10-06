from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import detail_route, list_route
from rest_framework.response import Response

from accounts.models import Profile
from action.models import Like, PurchaseHistory
from shop.models import Item
from uploader.models import UserImage

from .permissions import IsOwner
from .serializer import (BasicUserSerializer, FullUserSerializer,
                         ItemSerializer, LikeSerializer, ProfileSerializer,
                         PurchaseHistorySerializer, UserImageSerializer)


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


class ItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

    def get_serializer_context(self):
        return {'request': self.request}

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

    def list_handler(self, request, object, serializer_class):
        queryset = object.objects.filter(owner=request.user)
        serializer = serializer_class(queryset, many=True)
        return Response(serializer.data)

    @list_route()
    def likes(self, request):
        return self.list_handler(request, Like, LikeSerializer)

    @list_route()
    def purchase_history(self, request):
        return self.list_handler(request, PurchaseHistory, PurchaseHistorySerializer)

    @detail_route(methods=['get', 'post', 'delete'])
    def like(self, request, pk=None):
        return self.detail_handler(request, Like)

    @detail_route(methods=['get', 'post', 'delete'])
    def purchase(self, request, pk=None):
        return self.detail_handler(request, PurchaseHistory)


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

    def get_serializer_for_search(self, queryset, request):
        return ItemSerializer(queryset, many=True, context={'request': request})

    def get_queryset_for_search(self, paths):
        return Item.objects.filter(image__in=paths)

    @detail_route(methods=['get', ])
    def similar(self, request, pk=None):
        target_image = self.get_object()
        paths = [
            'shop_item/images/d2040ebda6491a956be6bb1cd3ee0dbe2a8757d5_C8FWZ4N.jpg', #98
            'shop_item/images/ba0d45347428fcc5c133cfb8bdb5df82e50355f5_q5mqoOF.jpg', #6
            'shop_item/images/300404cfea1bf29778964e496b534555627ac58f_jKI1Nw5.jpg', #16
        ]
        queryset = self.get_queryset_for_search(paths)
        serializer = self.get_serializer_for_search(queryset, request)
        return Response(serializer.data)

    @detail_route(methods=['get', ])
    def suitable(self, request, pk=None):
        target_image = self.get_object()

        return Response("suitable response")
