from django.conf.urls import include, url

from .views import dashboard_view
from django.contrib.auth.views import logout

urlpatterns = [
    url(r'^dashboard/$', dashboard_view, name='dashboard'),
    url(r'^logout/$', logout, {'next_page': '/'})
]
