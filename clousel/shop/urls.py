from django.conf.urls import include, url

from .views import index_view, likes_view, purchases_view, detail_view

urlpatterns = [
    url(r'^$', index_view, name='index'),
    url(r'^likes/$', likes_view, name='likes'),
    url(r'^purchases/$', purchases_view, name='purchases'),
    url(r'^(?P<pk>[0-9]+)/$', detail_view, name='detail'),
]
