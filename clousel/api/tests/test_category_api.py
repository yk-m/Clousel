import datetime
import logging

from django.contrib.auth import get_user_model
from django.core import mail
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase, force_authenticate
from rest_framework_jwt import utils
from registration.models import RegistrationProfile

from clothing.models import Category

logger = logging.getLogger("debug")


class CategoryAPITest(APITestCase):

    category_a = "a"
    category_a_num = 5
    category_b = "b"
    category_b_num = 5
    test_category_num = category_a_num + category_b_num

    @classmethod
    def setUpTestData(cls):
        """
        setUp for testing
        """
        cls.User = get_user_model()
        cls.user = cls.User.objects.create_user(
            email='user@example.com', password='')
        cls._create_categories(CategoryAPITest.category_b,
                               CategoryAPITest.category_b_num)
        cls._create_categories(CategoryAPITest.category_a,
                               CategoryAPITest.category_a_num)

    @classmethod
    def _create_categories(cls, name, num):
        previous = Category.objects.create(name=name, parent=None)
        for i in range(0, num - 1):
            previous = Category.objects.create(
                name=name, parent=previous)

    def test_list(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('api:category-list'), None, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), CategoryAPITest.test_category_num)

        # 取得順: カテゴリ名順 + level昇順
        categories_a = response.data[:CategoryAPITest.category_a_num]
        for i, category in enumerate(categories_a):
            self.assertEqual(category['name'], CategoryAPITest.category_a)
            self.assertEqual(category['level'], i)
        categories_b = response.data[CategoryAPITest.category_a_num:]
        for i, category in enumerate(categories_b):
            self.assertEqual(category['name'], CategoryAPITest.category_b)
            self.assertEqual(category['level'], i)

    def test_list_with_no_login(self):
        response = self.client.get(reverse('api:category-list'), None, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
