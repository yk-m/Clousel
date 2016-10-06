import registration.backends.default.urls
from django.conf.urls import include, url
from django.contrib.auth.views import logout

from .views import dashboard_view

urlpatterns = [
    url(r'^dashboard/$', dashboard_view, name='dashboard'),
    url(r'^logout/$',
        logout,
        {'template_name': 'registration/logout.html', 'next_page': '/'},
        name='auth_logout'),
    url(r'^', include('registration.backends.default.urls')),
]
