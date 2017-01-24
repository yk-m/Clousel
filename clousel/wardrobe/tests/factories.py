import random

from wardrobe.models import UserItem


class UserItemFactory():

    @classmethod
    def create(cls, user, category, image_file, title="My Item"):
        return UserItem.objects.create(
            owner=user,
            category=category,
            image=image_file,
            title=title,
            has_bought=random.randint(0, 1) is 1,
        )

