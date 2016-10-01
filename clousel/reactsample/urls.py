from django.conf.urls import include, url

from .views import index, list, shop_item_list, staticlist

urlpatterns = [
    url(r'^index/', index),
    url(r'^list/', list),
    url(r'^shopitemlist/', shop_item_list),
    url(r'^staticlist/', staticlist),
]
