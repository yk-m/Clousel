from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, render

from .models import Item


@login_required
def index_view(request):
    return render(
        request,
        'shop/index.html',
        {
            "request_url": "/api/items/",
            "page_title": "Shop items",
            "breadcrumbs_template": "includes/breadcrumbs-empty.html"
        },
    )


@login_required
def likes_view(request):
    return render(
        request,
        'shop/index.html',
        {
            "request_url": "/api/items/likes/",
            "page_title": "Likes",
            "breadcrumbs_template": "shop/includes/breadcrumbs-likes.html"
        },
    )


@login_required
def purchases_view(request):
    return render(
        request,
        'shop/index.html',
        {
            "request_url": "/api/items/purchases/",
            "page_title": "Items you already have",
            "breadcrumbs_template": "shop/includes/breadcrumbs-purchases.html"
        },
    )


@login_required
def detail_view(request, pk):
    item = get_object_or_404(Item, pk=pk)
    return render(request, 'shop/detail.html',
                  {"item": item})
