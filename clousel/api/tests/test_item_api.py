import logging

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.urlresolvers import reverse, resolve
from rest_framework import status
from rest_framework.test import APITestCase, force_authenticate

from action.models import Like, PurchaseHistory
from shop.models import Item
from .managers import ItemManager
from .testers import ItemTester

logger = logging.getLogger("debug")


class ItemAPITest(APITestCase):

    test_item_num = 10
    item_tester = ItemTester()

    @classmethod
    def setUpTestData(cls):
        """
        setUp for testing
        """
        cls.User = get_user_model()
        cls.user1 = cls.User.objects.create_user(
            email='user1@example.com', password='')
        cls.user2 = cls.User.objects.create_user(
            email='user2@example.com', password='')
        cls.items = ItemManager.create(cls.test_item_num)
        cls.user1_range = [1, 3, 5, 7, 9]
        ItemManager.set_up_actions(cls.items, cls.user1, cls.user1_range)
        cls.user2_range = [2, 4, 6, 8, 10]
        ItemManager.set_up_actions(cls.items, cls.user2, cls.user2_range)

    def _test_list(self, items, parameter):
        user = self.user1
        self.client.force_authenticate(user=user)
        response = self.client.get(reverse('api:item-list'), parameter, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for response_item, item in zip(response.data, items):
            self.assertEqual(response_item["pk"], item.pk)

    def test_list(self):
        self._test_list(Item.objects.all(), None)

    def test_list_ordering(self):
        self._test_list(Item.objects.order_by("price"), {'ordering': "price"})
        self._test_list(Item.objects.order_by("updated"), {'ordering': "updated"})

    def test_list_with_no_login(self):
        response = self.client.get(reverse('api:item-list'), None, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve(self):
        user = self.user1
        item = self.items[0]
        self.client.force_authenticate(user=user)
        response = self.client.get(
            reverse('api:item-detail', kwargs={'pk': item.pk}), None, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.item_tester.all(response.data, item, user)

    def test_retrieve_with_no_login(self):
        item = self.items[0]
        response = self.client.get(
            reverse('api:item-detail', kwargs={'pk': item.pk}), None, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_likes(self):
        user = self.user1
        item = self.items[0]
        self.client.force_authenticate(user=user)
        response = self.client.get(
            reverse('api:item-like', kwargs={'pk': item.pk}), None, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.item_tester.assertEqualLikes(response.data['count'], item)

    def test_get_purchases(self):
        user = self.user1
        item = self.items[0]
        self.client.force_authenticate(user=user)
        response = self.client.get(
            reverse('api:item-purchase', kwargs={'pk': item.pk}), None, format='json')
        self.item_tester.assertEqualPurchases(response.data['count'], item)

    def test_post_like(self):
        user = self.user1
        item = self.items[0]
        Like.objects.get(owner=user, item=item).delete()
        self.item_tester.assertEqualIsLiked(False, item, user)

        self.client.force_authenticate(user=user)
        response = self.client.post(
            reverse('api:item-like', kwargs={'pk': item.pk}), None, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.item_tester.assertEqualIsLiked(True, item, user)

    def test_post_purchase(self):
        user = self.user1
        item = self.items[0]
        PurchaseHistory.objects.get(owner=user, item=item).delete()
        self.item_tester.assertEqualIsPurchased(False, item, user)

        self.client.force_authenticate(user=user)
        response = self.client.post(
            reverse('api:item-purchase', kwargs={'pk': item.pk}), None, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.item_tester.assertEqualIsPurchased(True, item, user)

    def test_delete_like(self):
        user = self.user1
        item = self.items[0]
        Like.objects.update_or_create(owner=user, item=item)
        self.item_tester.assertEqualIsLiked(True, item, user)

        self.client.force_authenticate(user=user)
        response = self.client.delete(
            reverse('api:item-like', kwargs={'pk': item.pk}), None, format='json')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.item_tester.assertEqualIsLiked(False, item, user)

    def test_delete_purchase(self):
        user = self.user1
        item = self.items[0]
        PurchaseHistory.objects.update_or_create(owner=user, item=item)
        self.item_tester.assertEqualIsPurchased(True, item, user)

        self.client.force_authenticate(user=user)
        response = self.client.delete(
            reverse('api:item-purchase', kwargs={'pk': item.pk}), None, format='json')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.item_tester.assertEqualIsPurchased(False, item, user)

    def test_patch_like(self):
        user = self.user1
        item = self.items[0]
        self.client.force_authenticate(user=user)
        response = self.client.patch(
            reverse('api:item-like', kwargs={'pk': item.pk}), None, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_patch_purchase(self):
        user = self.user1
        item = self.items[0]
        self.client.force_authenticate(user=user)
        response = self.client.patch(
            reverse('api:item-purchase', kwargs={'pk': item.pk}), None, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
