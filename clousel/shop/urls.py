from django.conf.urls import include, url

from .views import index_view, similar_view, suitable_view

urlpatterns = [
    url(r'^$', index_view, name='index'),
    url(r'^similar/(?P<image_id>[0-9]+)/$', similar_view, name='similar'),
    url(r'^suitable/(?P<image_id>[0-9]+)/$', suitable_view, name='suitable'),
]
