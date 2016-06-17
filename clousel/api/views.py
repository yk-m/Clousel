import django_filters
from django.contrib.auth import get_user_model
from django.shortcuts import render
from rest_framework import filters, viewsets

from shop.models import Item

from .serializer import ItemSerializer, UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer


class ItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
