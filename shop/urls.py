from django.conf.urls import include, url

from .views import detail_view, index_view, similar_view, suitable_view

urlpatterns = [
    url(r'^$', index_view, name='index'),
    url(r'^(?P<pk>[0-9]+)/$', detail_view, name='detail'),
    url(r'^similar/(?P<image_id>[0-9]+)/$', similar_view, name='similar'),
    url(r'^suitable/(?P<image_id>[0-9]+)/$', suitable_view, name='suitable'),
]
