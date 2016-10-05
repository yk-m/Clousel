from django.conf.urls import include, url

from .views import dashboard_view


urlpatterns = [
    url(r'^dashboard/$', dashboard_view, name='dashboard'),
    url(r'^logout/$', 'django.contrib.auth.views.logout',
        {'next_page': '/'})
]
