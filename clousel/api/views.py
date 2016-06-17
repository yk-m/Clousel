import django_filters
from django.contrib.auth.models import User
from django.shortcuts import render
from rest_framework import filters, viewsets

from shop.models import Item

from .serializer import ItemSerializer, UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
