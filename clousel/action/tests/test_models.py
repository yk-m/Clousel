from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase

from action.models import Like, PurchaseHistory
from clothing.models import Category
from clothing.tests.factories import ImageFactory
from shop.tests.factories import ItemFactory


class UserOwnedTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.User = get_user_model()
        cls.user = cls.User.objects.create_user(
            email='miffy@example.com', password='')
        cls.category = Category.objects.create(name='one‐piece', parent=None)
        cls.category.save()
        cls.image_file = ImageFactory.create_uploaded_file('test.png')
        cls.item = ItemFactory.create(cls.category, cls.image_file)

    def test_create(self):
        like = Like.objects.create(
            owner=self.user,
            item=self.item
        )
        self.assertEqual(like.owner, self.user)
        self.assertEqual(like.item, self.item)

    def test_like_verbose_name_plural(self):
        self.assertEqual(str(Like._meta.verbose_name_plural), "likes")

    def test_like_validate_unique(self):
        like = Like(
            owner=self.user,
            item=self.item
        )
        like.full_clean()
        like.save()

        like2 = Like(
            owner=self.user,
            item=self.item
        )
        with self.assertRaises(ValidationError):
            like2.full_clean()

    def test_purchase_history_verbose_name_plural(self):
        self.assertEqual(
            str(PurchaseHistory._meta.verbose_name_plural), "purchase history")

    def test_purchase_validate_unique(self):
        purchase_history = PurchaseHistory(
            owner=self.user,
            item=self.item
        )
        purchase_history.full_clean()
        purchase_history.save()

        purchase_history2 = PurchaseHistory(
            owner=self.user,
            item=self.item
        )
        with self.assertRaises(ValidationError):
            purchase_history2.full_clean()
