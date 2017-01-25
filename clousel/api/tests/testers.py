from datetime import datetime
from pytz import timezone

from django.test import TestCase
from rest_framework.settings import api_settings

from action.models import Like, PurchaseHistory


class ClothingTester(TestCase):

    def all(self, response, item):
        self.assertEqualImage(response.pop('image'), item.image)
        self.assertEqualCategory(response.pop('category_name'), item.category)
        self.assertEqualDatetime(response.pop('created'), item.created)
        self.assertEqualDatetime(response.pop('updated'), item.updated)
        return response

    def assertEqualCategory(self, category_text, obj):
        self.assertEqual(category_text, repr(obj))

    def assertEqualImage(self, image_url, obj):
        pass

    def assertEqualDatetime(self, date_string, obj):
        try:
            dt = datetime.strptime(
                date_string, '%Y-%m-%dT%H:%M:%S.%fZ'
            ).replace(tzinfo=timezone('UTC'))
        except ValueError:
            dt = datetime.strptime(date_string, '%Y-%m-%dT%H:%M:%S.%f%zZ')
        self.assertEqual(dt, obj)


class ItemTester(TestCase):

    clothing_tester = ClothingTester()

    def all(self, response, item, user):
        response = self.clothing_tester.all(response, item)

        self.assertEqualLikes(response.pop('likes'), item)
        self.assertEqualPurchases(response.pop('purchases'), item)
        self.assertEqualIsLiked(response.pop('is_liked'), item, user)
        self.assertEqualIsPurchased(response.pop('is_purchased'), item, user)

        for key, value in response.items():
            self.assertEqual(value, getattr(item, key))

    def assertEqualLikes(self, response, item):
        likes = Like.objects.filter(item=item).count()
        self.assertEqual(response, likes)

    def assertEqualPurchases(self, response, item):
        purchases = PurchaseHistory.objects.filter(item=item).count()
        self.assertEqual(response, purchases)

    def assertEqualIsLiked(self, response, item, user):
        is_liked = Like.objects.filter(owner=user, item=item).exists()
        self.assertEqual(response, is_liked)

    def assertEqualIsPurchased(self, response, item, user):
        is_purchased = PurchaseHistory.objects.filter(owner=user, item=item).exists()
        self.assertEqual(response, is_purchased)


class UserItemTester(TestCase):

    clothing_tester = ClothingTester()

    def all(self, response, item, user):
        response = self.clothing_tester.all(response, item)
        self.assertEqualOwner(response.pop('owner'), user)

        for key, value in response.items():
            self.assertEqual(value, getattr(item, key))

    def assertEqualOwner(self, response, user):
        self.assertEqual(response, user.pk)

