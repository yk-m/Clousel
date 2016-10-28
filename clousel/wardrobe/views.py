import mimetypes

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.core.exceptions import SuspiciousFileOperation
from django.db import InternalError
from django.forms import ModelChoiceField
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, get_object_or_404

from PIL import Image

from .models import UserItem
from .forms import UserItemForm


@login_required
def image_view(request, filename):
    path = UserItem.UPLOAD_TO_DIR + filename
    user_image = get_object_or_404(UserItem, owner=request.user, image=path)

    return HttpResponse(user_image.image.read(), content_type=mimetypes.guess_type(filename)[0])


@login_required
def index_view(request):
    return render(request, 'wardrobe/list.html',
                  {"request_url": "/api/uploads/"})


@login_required
def upload_view(request):
    if request.method == 'POST':
        form = UserItemForm(request.POST, request.FILES)
        if form.is_valid():
            form.save(user=request.user)
            return HttpResponseRedirect('/')
    else:
        form = UserItemForm()

    return render(request, 'wardrobe/upload.html', {'form': form})


