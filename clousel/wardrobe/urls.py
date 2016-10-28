from django.conf.urls import include, url

from .views import index_view, upload_view

urlpatterns = [
    url(r'^$', index_view),
    url(r'^upload/$', upload_view),
]
