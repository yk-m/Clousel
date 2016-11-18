import logging

from django.contrib.auth import get_user_model
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase, force_authenticate
from rest_framework_jwt import utils

logger = logging.getLogger("debug")


class UserTests(APITestCase):

    TEST_USER_NUM = 10

    @classmethod
    def setUpTestData(cls):
        """
        setUp for testing
        """
        User = get_user_model()
        cls.superuser = User.objects.create_superuser(
            email='admin@example.com', password='')
        cls.user = User.objects.create_user(
            email='user@example.com', password='')
        for i in range(0, UserTests.TEST_USER_NUM - 2):
            User.objects.create_user(
                email="user{}@example.com".format(i), password='')

    def test_user_list_normal(self):
        """
        user-list: 一般ユーザ
        """
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('user-list'), None, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["pk"], self.user.pk)
        for user in response.data:
            self.assertTrue("pk" in user)
            self.assertTrue("email" in user)
            self.assertTrue("profile" in user)
            self.assertTrue("is_admin" not in user)
            self.assertTrue("last_login" not in user)
            self.assertTrue("date_joined" not in user)

    def test_user_list_super(self):
        """
        user-list: 管理者権限をもつユーザ
        """
        self.client.force_authenticate(user=self.superuser)
        response = self.client.get(reverse('user-list'), None, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), UserTests.TEST_USER_NUM)
        for user in response.data:
            self.assertTrue("pk" in user)
            self.assertTrue("email" in user)
            self.assertTrue("profile" in user)
            self.assertTrue("is_admin" in user)
            self.assertTrue("last_login" in user)
            self.assertTrue("date_joined" in user)
