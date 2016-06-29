import mimetypes

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.db import InternalError
from django.http import HttpResponse
from django.shortcuts import render
from PIL import Image

from .models import UserImage


def image_view(request, owner, filename):

    def get_image_path(owner, filename):
        return settings.MEDIA_ROOT + 'user/images/{0}/{1}'.format(owner, filename)

    if not request.user.is_authenticated():
        raise PermissionDenied()

    if str(request.user.id) != owner:
        raise PermissionDenied()

    try:
        with open(get_image_path(owner, filename), "rb") as f:
            return HttpResponse(f.read(), content_type=mimetypes.guess_type(filename)[0])

    except IOError:
        error_image = Image.new('RGBA', (100, 100), (198, 75, 143, 0))
        response = HttpResponse(content_type="image/jpeg")
        error_image.save(response, "JPEG")
        return response
