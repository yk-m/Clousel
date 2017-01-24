from action.models import Like, PurchaseHistory
from clothing.tests.factories import ImageFactory
from clothing.models import Category
from shop.tests.factories import ItemFactory
from wardrobe.tests.factories import UserItemFactory


class ItemManager():

    @classmethod
    def create(cls, num, category_name="category", image_file_name="test.png"):
        items = []
        category = Category.objects.create(name=category_name, parent=None)
        image_file = ImageFactory.create_uploaded_file(image_file_name)
        for i in range(0, num):
            items.append(ItemFactory.create(category, image_file))
        return items

    @classmethod
    def set_up_actions(cls, items, user, pk_range):
        cls._like(items, user, pk_range)
        cls._purchase(items, user, pk_range)

    @classmethod
    def _like(cls, items, user, pk_range):
        for pk in pk_range:
            Like.objects.create(owner=user, item=items[pk-1])

    @classmethod
    def _purchase(cls, items, user, pk_range):
        for pk in pk_range:
            PurchaseHistory.objects.create(owner=user, item=items[pk-1])


class UserItemManager():

    @classmethod
    def create(cls, user, num, category_name="category", image_file_name="test.png"):
        user_items = []
        category = Category.objects.create(name=category_name, parent=None)
        image_file = ImageFactory.create_uploaded_file(image_file_name)
        for i in range(0, num):
            user_items.append(UserItemFactory.create(user, category, image_file))
        return user_items

