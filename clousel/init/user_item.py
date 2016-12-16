import os

from django.contrib.auth import get_user_model
from django.core.files import File
from django.core.files.base import ContentFile

from clothing.models import Category
from wardrobe.models import UserItem


directory = os.listdir('/srv/app/data/user_images/')
user = get_user_model().objects.get(pk=12)
category = Category.objects.get(pk=1)

for filename in directory:
    i = UserItem(
        owner=user,
        category=category,
        has_bought=False
    )
    with open('/srv/app/data/user_images/' + filename, 'rb') as f:
        content = File(f)
        i.image.save(
            filename,
            content,
            save=False,
        )
        i.save()

