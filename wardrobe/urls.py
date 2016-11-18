from django.conf.urls import include, url

from .views import detail_view, index_view, upload_view

urlpatterns = [
    url(r'^$', index_view, name="index"),
    url(r'^(?P<pk>[0-9]+)/$', detail_view, name='detail'),
    url(r'^upload/$', upload_view, name='upload'),
]
