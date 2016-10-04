from django.shortcuts import render


def index_view(request):
    return render(request, 'reactsample/index.html')


def staticlist_view(request):
    return render(request, 'reactsample/staticlist.html')


def list_view(request):
    return render(request, 'reactsample/list.html')


def shop_item_list_view(request):
    return render(request, 'reactsample/shop_item_list.html')
