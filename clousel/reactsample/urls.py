from django.conf.urls import include, url

from .views import index_view, list_view, shop_item_list_view, staticlist_view


urlpatterns = [
    url(r'^index/$', index_view),
    url(r'^list/$', list_view),
    url(r'^shopitemlist/$', shop_item_list_view),
    url(r'^staticlist/$', staticlist_view),
]
