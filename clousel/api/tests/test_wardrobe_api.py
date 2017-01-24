import logging

from django.contrib.auth import get_user_model
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase, force_authenticate

from clothing.tests.factories import TmpImageFactory
from clothing.models import Category
from wardrobe.models import UserItem
from .testers import UserItemTester
from .managers import UserItemManager

logger = logging.getLogger("debug")


class WardrobeAPITest(APITestCase):

    model = UserItem
    url = "api:wardrobe-{0}"

    item_tester = UserItemTester()
    test_num = 10

    category_model = Category

    @classmethod
    def setUpTestData(cls):
        """
        setUp for testing
        """
        cls.User = get_user_model()
        cls.superuser = cls.User.objects.create_superuser(
            email='admin@example.com', password='')
        cls.user1 = cls.User.objects.create_user(
            email='user1@example.com', password='')
        cls.user2 = cls.User.objects.create_user(
            email='user2@example.com', password='')
        cls.user1_items = UserItemManager.create(cls.user1, cls.test_num,
                                                 category_name="user1")
        cls.user2_items = UserItemManager.create(cls.user2, cls.test_num,
                                                 category_name="user2")

    def test_create_valid_data(self):
        user = self.user1
        image = TmpImageFactory.create()
        category = self.category_model.objects.create(name="test_create_valid_data", parent=None)

        self.client.force_authenticate(user=user)
        with open(image.name, 'rb') as image:
            user_item_data = {
                'image': image,
                'category': category.pk,
                'title': "My Clothing",
                'has_bought': True
            }
            response = self.client.post(
                reverse(self.url.format('list')), user_item_data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data.get('category_name'), repr(category))
        self.assertEqual(response.data.get('title'), user_item_data.get('title'))
        self.assertEqual(response.data.get('has_bought'), user_item_data.get('has_bought'))

    def test_create_blank_data(self):
        user = self.user1
        self.client.force_authenticate(user=user)
        response = self.client.post(
            reverse(self.url.format('list')), {}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_with_no_login(self):
        response = self.client.post(reverse('api:wardrobe-list'), {}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list(self):
        user = self.user1
        self.client.force_authenticate(user=user)
        response = self.client.get(
            reverse(self.url.format('list')), None, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), self.test_num)
        user_items = self.model.objects.filter(owner=user).order_by('-updated')
        for response_item, user_item in zip(response.data, user_items):
            self.assertEqual(response_item["pk"], user_item.pk)

    def test_list_with_no_login(self):
        response = self.client.get(reverse('api:wardrobe-list'), None, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve(self):
        user = self.user1
        user_item = self.user1_items[0]
        self.client.force_authenticate(user=user)
        response = self.client.get(
            reverse(self.url.format('detail'), kwargs={'pk': user_item.pk}), None, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.item_tester.all(response.data, user_item, user)

    def test_retrieve_with_no_login(self):
        user_item = self.user1_items[0]
        response = self.client.get(
            reverse(self.url.format('detail'), kwargs={'pk': user_item.pk}), None, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_others_item(self):
        user = self.user1
        user_item = self.user2_items[0]
        response = self.client.get(
            reverse(self.url.format('detail'), kwargs={'pk': user_item.pk}), None, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update(self):
        user = self.user1
        user_item = self.user1_items[0]
        image = TmpImageFactory.create()
        category = self.category_model.objects.create(name="test_update")

        self.client.force_authenticate(user=user)
        with open(image.name, 'rb') as image:
            user_item_data = {
                'image': image,
                'category': category.pk,
                'title': "My Clothing",
                'has_bought': True
            }
            response = self.client.patch(
                reverse(self.url.format('detail'), kwargs={'pk': user_item.pk}), user_item_data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('category_name'), repr(category))
        self.assertEqual(response.data.get('title'), user_item_data.get('title'))
        self.assertEqual(response.data.get('has_bought'), user_item_data.get('has_bought'))

    def test_update_with_no_login(self):
        user_item = self.user1_items[0]
        response = self.client.patch(
            reverse(self.url.format('detail'), kwargs={'pk': user_item.pk}), None, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_others_item(self):
        user = self.user1
        user_item = self.user2_items[0]
        response = self.client.patch(
            reverse(self.url.format('detail'), kwargs={'pk': user_item.pk}), None, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_destroy(self):
        user = self.user1
        user_item = self.user1_items[0]
        self.client.force_authenticate(user=user)
        response = self.client.delete(
            reverse(self.url.format('detail'), kwargs={'pk': user_item.pk}), None, format='json')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(self.model.DoesNotExist):
            self.model.objects.get(pk=user_item.pk)

    def test_destroy_with_no_login(self):
        user_item = self.user1_items[0]
        response = self.client.delete(
            reverse(self.url.format('detail'), kwargs={'pk': user_item.pk}), None, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_destroy_others_item(self):
        user = self.user1
        user_item = self.user2_items[0]
        response = self.client.delete(
            reverse(self.url.format('detail'), kwargs={'pk': user_item.pk}), None, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

