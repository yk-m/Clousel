import mimetypes

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.core.exceptions import SuspiciousFileOperation
from django.core.urlresolvers import reverse
from django.db import InternalError
from django.forms import ModelChoiceField
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from PIL import Image

from .forms import UserItemForm
from .models import UserItem


@login_required
def image_view(request, filename):
    path = UserItem.UPLOAD_TO_DIR + filename
    user_image = get_object_or_404(UserItem, owner=request.user, image=path)

    return HttpResponse(user_image.image.read(), content_type=mimetypes.guess_type(filename)[0])


@login_required
def index_view(request):
    return render(request, 'wardrobe/index.html',
                  {"request_url": "/api/wardrobe/"})


@login_required
def upload_view(request):
    if request.method == 'POST':
        form = UserItemForm(request.POST, request.FILES)
        if form.is_valid():
            user_item = form.save(user=request.user)
            return HttpResponseRedirect(reverse('wardrobe:detail', kwargs={'pk': user_item.pk}))
    else:
        form = UserItemForm()

    return render(request, 'wardrobe/upload.html', {'form': form})


@login_required
def detail_view(request, pk):
    user_item = get_object_or_404(UserItem, owner=request.user, pk=pk)
    user_item.save(update_fields=['updated'])
    return render(request, 'wardrobe/detail.html',
                  {"user_item": user_item})


@login_required
def edit_view(request, pk):
    user_item = get_object_or_404(UserItem, owner=request.user, pk=pk)
    if request.method == 'POST':
        form = UserItemForm(request.POST, request.FILES, instance=user_item)
        if form.is_valid():
            form.save(user=request.user)
            return HttpResponseRedirect(reverse('wardrobe:detail', kwargs={'pk': pk}))
    else:
        form = UserItemForm(instance=user_item)

    return render(request, 'wardrobe/edit.html', {'form': form, "user_item": user_item})


@login_required
def delete_view(request, pk):
    user_item = get_object_or_404(UserItem, owner=request.user, pk=pk)
    user_item.delete()
    return HttpResponseRedirect(reverse('wardrobe:index'))


@login_required
def similar_view(request, pk):
    user_item = get_object_or_404(UserItem, owner=request.user, pk=pk)
    return render(
        request,
        'shop/index.html',
        {
            "request_url": "/api/wardrobe/" + pk + "/similar/",
            "page_title": "Similar items",
            "breadcrumbs_template": "wardrobe/includes/breadcrumbs-similar.html",
            "user_item": user_item,
        },
    )


@login_required
def suitable_view(request, pk):
    user_item = get_object_or_404(UserItem, owner=request.user, pk=pk)
    return render(
        request,
        'shop/index.html',
        {
            "request_url": "/api/wardrobe/" + pk + "/suitable/",
            "page_title": "Suitable items",
            "breadcrumbs_template": "wardrobe/includes/breadcrumbs-suitable.html",
            "user_item": user_item,
        },
    )
