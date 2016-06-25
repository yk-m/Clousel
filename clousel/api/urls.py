from django.conf.urls import include, url
from django.contrib.auth import get_user_model
from rest_framework import routers

from .views import ItemViewSet, UserViewSet

router = routers.SimpleRouter()
router.register(r'users', UserViewSet)
router.register(r'items', ItemViewSet)
