from django.conf.urls import include, url
from django.contrib.auth import get_user_model
from rest_framework import routers
from rest_framework_jwt import views

from .views import ItemViewSet, ItemListView, UserImageViewSet, UserViewSet

router = routers.SimpleRouter()
router.register(r'users', UserViewSet)
router.register(r'items', ItemViewSet)
router.register(r'uploads', UserImageViewSet)

urlpatterns = [
    url(r'api-token-auth/$', views.obtain_jwt_token),
    url(r'items/', ItemListView.as_view()),
]

urlpatterns += router.urls
