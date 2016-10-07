from django.conf.urls import include, url
from django.contrib.auth import get_user_model
from rest_framework import routers
from rest_framework_jwt import views

from .views import ItemViewSet, SearchableItemListView, SimilarListView, SuitableListView, UserImageViewSet, UserViewSet

urlpatterns = [
    url(r'api-token-auth/$', views.obtain_jwt_token),
    url(r'uploads/(?P<pk>[0-9]+)/similar/$', SimilarListView.as_view()),
    url(r'uploads/(?P<pk>[0-9]+)/suitable/$', SuitableListView.as_view()),
    url(r'items/$', SearchableItemListView.as_view()),
]

router = routers.SimpleRouter()
router.register(r'users', UserViewSet)
router.register(r'items', ItemViewSet)
router.register(r'uploads', UserImageViewSet)

urlpatterns += router.urls
