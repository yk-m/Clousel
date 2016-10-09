from django.contrib.auth.decorators import login_required
from django.shortcuts import render


@login_required
def list_view(request):
    return render(request, 'recommender/list.html',
                  {"request_url": "/api/items/"})


@login_required
def similar_view(request, image_id):
    return render(request, 'recommender/list.html',
                  {"request_url": "/api/uploads/" + image_id + "/similar/"})


@login_required
def suitable_view(request, image_id):
    return render(request, 'recommender/list.html',
                  {"request_url": "/api/uploads/" + image_id + "/suitable/"})
