from django.conf.urls import include, url

from .views import index_view, detail_view, upload_view

urlpatterns = [
    url(r'^$', index_view, name="index"),
    url(r'^(?P<pk>[0-9]+)/$', detail_view, name='detail'),
    url(r'^upload/$', upload_view, name='upload'),
]
