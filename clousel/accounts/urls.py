from django.conf.urls import include, url

from .views import detail_view, edit_view, delete_view


urlpatterns = [
    url(r'^detail/$', detail_view, name='detail'),
    url(r'^edit/$', edit_view, name='edit'),
    url(r'^delete/$', delete_view, name='delete'),
]
