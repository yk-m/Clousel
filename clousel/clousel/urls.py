"""clousel URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin, auth
from django.contrib.auth.views import login, logout

import registration

from api.urls import urlpatterns
from uploader.views import image_view

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/', include(urlpatterns)),
    # url(r'^accounts/login/$', auth.views.login,
    #     {'template_name': 'login.html'}, name="login"),
    # url(r'^accounts/logout/$', auth.views.logout),
    url(r'^accounts/', include('registration.backends.default.urls')),
    url(r'^media/user/images/(?P<owner>[0-9]+)/((?P<filename>[0-9a-z.]+))$', image_view)
] + static(settings.MEDIA_URL + 'shop_item/', document_root=settings.MEDIA_ROOT + 'shop_item/')
