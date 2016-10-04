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
import registration
from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin, auth
from django.contrib.auth.views import login, logout

import accounts.urls
import api.urls
import pages.urls
import reactsample.urls
import uploader.urls


urlpatterns = [
    url(r'^', include(pages.urls, namespace="pages")),
    url(r'^accounts/', include('accounts.urls')),
    url(r'^reactsample/', include(reactsample.urls, namespace="reactsample")),
    url(r'^media/user/', include(uploader.urls, namespace="uploads")),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include(api.urls)),
    url(r'^accounts/', include('registration.backends.default.urls')),
]

urlpatterns += static(settings.MEDIA_URL + 'shop_item/',
                      document_root=settings.MEDIA_ROOT + 'shop_item/')
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
