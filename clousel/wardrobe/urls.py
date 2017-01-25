from django.conf.urls import include, url

from .views import (delete_view, detail_view, edit_view, index_view,
                    similar_view, suitable_view, upload_view)

urlpatterns = [
    url(r'^$', index_view, name="index"),
    url(r'^(?P<pk>[0-9]+)/$', detail_view, name='detail'),
    url(r'^upload/$', upload_view, name='upload'),
    url(r'^(?P<pk>[0-9]+)/edit/$', edit_view, name='edit'),
    url(r'^(?P<pk>[0-9]+)/delete/$', delete_view, name='delete'),
    url(r'^(?P<pk>[0-9]+)/similar/$', similar_view, name='similar'),
    url(r'^(?P<pk>[0-9]+)/suitable/$', suitable_view, name='suitable'),
]
