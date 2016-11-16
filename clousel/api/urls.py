from django.conf.urls import include, url
from django.contrib.auth import get_user_model
from rest_framework import routers
from rest_framework_jwt import views

from .views import (CategoryListView, ItemDetailView, LikeListView,
                    PurchaseHistoryListView, SearchableItemListView,
                    SimilarListView, SuitableListView, UserItemViewSet,
                    UserViewSet)

urlpatterns = [
    url(r'api-token-auth/$', views.obtain_jwt_token),
    url(r'categories/$', CategoryListView.as_view()),
    url(r'likes/$', LikeListView.as_view()),
    url(r'purchases/$', PurchaseHistoryListView.as_view()),
    url(r'items/$', SearchableItemListView.as_view()),
    url(r'uploads/(?P<pk>[0-9]+)/similar/$', SimilarListView.as_view()),
    url(r'uploads/(?P<pk>[0-9]+)/suitable/$', SuitableListView.as_view()),
]

router = routers.SimpleRouter()
router.register(r'users', UserViewSet, base_name="user")
router.register(r'items', ItemDetailView, base_name="item")
router.register(r'uploads', UserItemViewSet, base_name="uploads")

urlpatterns += router.urls
