import registration.backends.default.urls
from django.conf.urls import include, url
from django.contrib.auth.views import logout
from django.views.generic.base import RedirectView

urlpatterns = [
    url(r'^logout/$',
        logout,
        {'template_name': 'registration/logout.html', 'next_page': '/'},
        name='auth_logout'),
    url(r'^activate/complete/$',
        RedirectView.as_view(url='/', permanent=False),
        name='registration_activation_complete'),
    url(r'^', include('registration.backends.default.urls')),
]
