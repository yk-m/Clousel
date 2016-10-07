from django.conf.urls import include, url

from .views import list_view, similar_view, suitable_view

urlpatterns = [
    url(r'^list/$', list_view),
    url(r'^similar/(?P<image_id>[0-9]+)/$', similar_view),
    url(r'^suitable/(?P<image_id>[0-9]+)/$', suitable_view),
]
