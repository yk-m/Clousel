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
from django.contrib import admin
from django.views.i18n import javascript_catalog

import accounts.auth_urls
import accounts.urls
import api.urls
import pages.urls
import shop.urls
import wardrobe.urls
from wardrobe.views import image_view

js_info_dict = {
    'packages': ('assets', ),
}

urlpatterns = [
    url(r'^', include(pages.urls, namespace="pages")),
    url(r'^accounts/', include(accounts.auth_urls)),
    url(r'^accounts/', include(accounts.urls, namespace="accounts")),
    url(r'^shop/', include(shop.urls, namespace="shop")),
    url(r'^wardrobe/', include(wardrobe.urls, namespace="wardrobe")),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include(api.urls, namespace="api")),
    url(r'^media/user/images/((?P<filename>[0-9a-z.]+))$',
        image_view, name="user-image"),
    url(r'^jsi18n/$', javascript_catalog, js_info_dict, name='javascript-catalog'),
]

urlpatterns += static(settings.MEDIA_URL + 'shop_item/',
                      document_root=settings.MEDIA_ROOT + 'shop_item/')
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if settings.DEBUG:
    import debug_toolbar
    urlpatterns.append(
        url(r'^__debug__/', include(debug_toolbar.urls))
    )
