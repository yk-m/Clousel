import datetime
import logging

from django.contrib.auth import get_user_model
from django.core import mail
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase, force_authenticate
from registration.models import RegistrationProfile

logger = logging.getLogger("debug")


class UserAPITest(APITestCase):

    test_user_num = 10
    RegistrationProfile = RegistrationProfile

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
        for i in range(0, UserAPITest.test_user_num - 2):
            cls.User.objects.create_user(
                email="user{}@example.com".format(i), password='')

    def test_create_valid_data(self):
        """
        ユーザ作成
        """
        user_data = {
            'email': "miffy@example.com",
            'password': "dickbruna",
            'profile': {
                'name': "Miffy",
                'date_of_birth': datetime.date(1955, 1, 1)
            }
        }

        response = self.client.post(
            reverse('api:user-list'), user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        user = self.User.objects.get(email=user_data.get('email'))
        self.assertEqual(user.profile.name, user_data['profile']['name'])

        # New user must not be active.
        self.failIf(user.is_active)

        # A registration profile was created, and an activation email
        # was sent.
        self.assertEqual(self.RegistrationProfile.objects.count(), 1)
        self.assertEqual(len(mail.outbox), 1)

    def test_create_blank_data(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            reverse('api:user-list'), {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_duplicate_data(self):
        self.client.force_authenticate(user=self.user)
        user_data = {
            'email': "user@example.com",
            'password': "dickbruna"
        }

        response = self.client.post(
            reverse('api:user-list'), user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_normal(self):
        """
        user-list: 一般ユーザ
        """
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('api:user-list'), None, format='json')

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
        response = self.client.get(reverse('api:user-list'), None, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), UserAPITest.test_user_num)
        for user in response.data:
            self.assertTrue("pk" in user)
            self.assertTrue("email" in user)
            self.assertTrue("profile" in user)
            self.assertTrue("is_admin" in user)
            self.assertTrue("last_login" in user)
            self.assertTrue("date_joined" in user)

    def test_list_with_no_login(self):
        response = self.client.get(reverse('api:user-list'), None, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(
            reverse('api:user-detail', kwargs={'pk': self.user.pk}), None, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user = response.data
        self.assertTrue("pk" in user)
        self.assertTrue("email" in user)
        self.assertTrue("profile" in user)
        self.assertTrue("is_admin" not in user)
        self.assertTrue("last_login" not in user)
        self.assertTrue("date_joined" not in user)

    def test_retrieve_with_no_login(self):
        response = self.client.get(
            reverse('api:user-detail', kwargs={'pk': self.user.pk}), None, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update(self):
        user = self.User.objects.create_user(
            email='update@example.com', password='')
        self.assertEqual(user.profile.name, "")
        self.assertEqual(user.profile.date_of_birth, None)
        self.client.force_authenticate(user=user)

        user_data = {
            'profile': {
                'name': "Miffy",
                'date_of_birth': datetime.date(1955, 1, 1)
            }
        }
        response = self.client.patch(
            reverse('api:user-detail', kwargs={'pk': user.pk}), user_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user = self.User.objects.get(pk=user.pk)
        self.assertEqual(user.profile.name,
                         user_data['profile']['name'])
        self.assertEqual(user.profile.date_of_birth,
                         user_data['profile']['date_of_birth'])

    def test_update_with_no_login(self):
        response = self.client.patch(
            reverse('api:user-detail', kwargs={'pk': self.user.pk}), None, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_destroy(self):
        user = self.User.objects.create_user(
            email='destroy@example.com', password='')
        self.client.force_authenticate(user=user)
        response = self.client.delete(
            reverse('api:user-detail', kwargs={'pk': user.pk}), None, format='json')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        user = self.User.objects.get(pk=user.pk)
        self.assertEqual(user.is_active, False)

    def test_destroy_with_no_login(self):
        user = self.User.objects.create_user(
            email='destroy@example.com', password='')
        response = self.client.delete(
            reverse('api:user-detail', kwargs={'pk': user.pk}), None, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

