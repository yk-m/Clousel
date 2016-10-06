from django.conf.urls import include, url

from .views import image_view

urlpatterns = [
    url(r'^images/^(?P<owner>[0-9]+)/((?P<filename>[0-9a-z.]+))$',
        image_view, name="userimages"),
]
