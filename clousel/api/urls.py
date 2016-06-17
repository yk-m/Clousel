from rest_framework import routers

from .views import ItemViewSet, UserViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'items', ItemViewSet)
