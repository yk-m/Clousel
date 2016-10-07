from django.conf.urls import include, url

from .views import list_view

urlpatterns = [
    url(r'^list/$', list_view),
]
