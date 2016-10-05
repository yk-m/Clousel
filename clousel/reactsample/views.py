from django.contrib.auth.decorators import login_required
from django.shortcuts import render


@login_required
def index_view(request):
    return render(request, 'reactsample/index.html')


@login_required
def staticlist_view(request):
    return render(request, 'reactsample/staticlist.html')


@login_required
def list_view(request):
    return render(request, 'reactsample/list.html')


@login_required
def shop_item_list_view(request):
    return render(request, 'reactsample/shop_item_list.html')
