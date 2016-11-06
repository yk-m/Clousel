from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, render

from .models import Item


@login_required
def index_view(request):
    return render(request, 'shop/list.html',
                  {"request_url": "/api/items/"})


@login_required
def detail_view(request, pk):
    item = get_object_or_404(Item, pk=pk)
    return render(request, 'shop/detail.html',
                  {"item": item})


@login_required
def similar_view(request, image_id):
    return render(request, 'shop/list.html',
                  {"request_url": "/api/uploads/" + image_id + "/similar/"})


@login_required
def suitable_view(request, image_id):
    return render(request, 'shop/list.html',
                  {"request_url": "/api/uploads/" + image_id + "/suitable/"})
