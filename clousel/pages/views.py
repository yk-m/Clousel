from django.shortcuts import render


def index(request):
    return render(request, 'index.html')


def list(request):
    return render(request, 'list1.html')
