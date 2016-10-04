from django.conf.urls import include, url

from .views import dashboard_view


urlpatterns = [
    url(r'^dashboard/$', dashboard_view, name='dashboard'),
]
