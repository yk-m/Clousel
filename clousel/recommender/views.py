from django.contrib.auth.decorators import login_required
from django.shortcuts import render


@login_required
def list_view(request):
    return render(request, 'recommender/list.html')