from django.conf.urls import include, url

from .views import index_view, list_view

urlpatterns = [
    url(r'^$', index_view, name='index'),
    url(r'^list/$', list_view, name='list'),
]
