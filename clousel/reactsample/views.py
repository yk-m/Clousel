from django.shortcuts import render


def index(request):
    return render(request, 'reactsample/index.html')


def staticlist(request):
    return render(request, 'reactsample/staticlist.html')


def list(request):
    return render(request, 'reactsample/list.html')


def shop_item_list(request):
    return render(request, 'reactsample/shop_item_list.html')
