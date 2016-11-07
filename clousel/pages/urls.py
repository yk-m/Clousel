from django.conf.urls import include, url

from .views import dashboard_view, index_view

urlpatterns = [
    url(r'^$', index_view, name='index'),
    url(r'^dashboard/$', dashboard_view, name='dashboard'),
]
