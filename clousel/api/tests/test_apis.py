import datetime
import logging

from django.contrib.auth import get_user_model
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase, force_authenticate
from rest_framework_jwt import utils

logger = logging.getLogger("debug")


class UserAPITest(APITestCase):

    TEST_USER_NUM = 10

    @classmethod
    def setUpTestData(cls):
        """
        setUp for testing
        """
        cls.User = get_user_model()
        cls.superuser = cls.User.objects.create_superuser(
            email='admin@example.com', password='')
        cls.user = cls.User.objects.create_user(
            email='user@example.com', password='')
        for i in range(0, UserAPITest.TEST_USER_NUM - 2):
            cls.User.objects.create_user(
                email="user{}@example.com".format(i), password='')

    def test_create_valid_data(self):
        user_data = {
            'email': "miffy@example.com",
            'password': "dickbruna",
            'profile': {
                'name': "Miffy",
                'date_of_birth': datetime.date(1955, 1, 1)
            }
        }

        response = self.client.post(reverse('user-list'), user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        user = self.User.objects.get(email=user_data.get('email'))
        self.assertEqual(user.profile.name, user_data['profile']['name'])

    def test_list_normal(self):
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

    def test_list_super(self):
        """
        user-list: 管理者権限をもつユーザ
        """
        self.client.force_authenticate(user=self.superuser)
        response = self.client.get(reverse('user-list'), None, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), UserAPITest.TEST_USER_NUM)
        for user in response.data:
            self.assertTrue("pk" in user)
            self.assertTrue("email" in user)
            self.assertTrue("profile" in user)
            self.assertTrue("is_admin" in user)
            self.assertTrue("last_login" in user)
            self.assertTrue("date_joined" in user)
