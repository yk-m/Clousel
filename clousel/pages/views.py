from django.shortcuts import render


def index_view(request):
    return render(request, 'index.html')


def list_view(request):
    return render(request, 'list1.html')
