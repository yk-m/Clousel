from django.conf.urls import include, url
from django.contrib.auth import get_user_model
from rest_framework import routers
from rest_framework.authtoken import views

from .views import ItemViewSet, UserImageViewSet, UserViewSet

router = routers.SimpleRouter()
router.register(r'users', UserViewSet)
router.register(r'items', ItemViewSet)
router.register(r'uploads', UserImageViewSet)

urlpatterns = [
    url(r'^api-token-auth/', views.obtain_auth_token),
]

urlpatterns += router.urls
