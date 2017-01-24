import logging

from django.contrib.auth import get_user_model
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase, force_authenticate

from action.models import Like, PurchaseHistory
from .managers import ItemManager

logger = logging.getLogger("debug")


class ActionAPITest(APITestCase):

    test_item_num = 10

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

    def _test_list(self, url, user, user_range):
        self.client.force_authenticate(user=user)
        response = self.client.get(reverse(url), None, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), self.test_item_num/2)
        for item, pk in zip(response.data, user_range):
            self.assertEqual(item['item']['pk'], pk)

    def test_like_list_user1(self):
        self._test_list('api:like-list', self.user1, self.user1_range)

    def test_like_list_user2(self):
        self._test_list('api:like-list', self.user2, self.user2_range)

    def test_like_list_with_no_login(self):
        response = self.client.get(reverse('api:like-list'), None, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_purchase_list_user1(self):
        self._test_list('api:purchase-list', self.user1, self.user1_range)

    def test_purchase_list_user2(self):
        self._test_list('api:purchase-list', self.user2, self.user2_range)

    def test_like_list_with_no_login(self):
        response = self.client.get(reverse('api:purchase-list'), None, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
