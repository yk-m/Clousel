import logging

from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from shop.models import Item
from wardrobe.models import UserItem

logger = logging.getLogger("debug")


def index_view(request):
    return render(request, 'pages/index.html')


@login_required
def dashboard_view(request):
    context = {
        'items': Item.objects.order_by('-updated', '-created')[:4],
        'user_items': UserItem.objects.order_by('-updated', '-created')[:4],
    }
    return render(request, 'pages/dashboard.html',
                  {
                    "item_request_url": "/api/items/",
                    "user_item_request_url": "/api/uploads/",
                  })
