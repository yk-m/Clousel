from django.conf.urls import include, url
from django.contrib.auth import get_user_model
from rest_framework import routers
from rest_framework_jwt import views

from .views import (CategoryListView, ItemDetailView, LikeListView,
                    PurchaseHistoryListView, SearchableItemListView,
                    SimilarListView, SuitableListView, UserItemViewSet,
                    UserViewSet)

urlpatterns = [
    url(r'^api-token-auth/$',
        views.obtain_jwt_token, name='token'),
    url(r'^categories/$',
        CategoryListView.as_view(), name='category-list'),
    url(r'^items/$',
        SearchableItemListView.as_view(), name='item-list'),
    url(r'^items/likes/$',
        LikeListView.as_view(), name='like-list'),
    url(r'^items/purchases/$',
        PurchaseHistoryListView.as_view(), name='purchase-list'),
    url(r'^wardrobe/(?P<pk>[0-9]+)/similar/$',
        SimilarListView.as_view(), name='wardrobe-detail-similar'),
    url(r'^wardrobe/(?P<pk>[0-9]+)/suitable/$',
        SuitableListView.as_view(), name='wardrobe-detail-suitable'),
]

router = routers.SimpleRouter()
router.register(r'users', UserViewSet, base_name="user")
router.register(r'items', ItemDetailView, base_name="item")
router.register(r'wardrobe', UserItemViewSet, base_name="wardrobe")

urlpatterns += router.urls
