import logging

from django.contrib.auth import get_user_model
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase, force_authenticate

logger = logging.getLogger("debug")


class APITest(APITestCase):

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

    def test_create_valid_data(self):
        foo_data = {
            'foo': "bar"
        }

        response = self.client.post(
            reverse('foo-list'), foo_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_blank_data(self):
        response = self.client.post(
            reverse('foo-list'), {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('foo-list'), None, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["pk"], self.foo.pk)
        for foo in response.data:
            self.assertTrue("" in foo)

    def test_list_with_no_login(self):
        response = self.client.get(reverse('foo-list'), None, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(
            reverse('foo-detail', kwargs={'pk': foo.pk}), None, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_with_no_login(self):
        response = self.client.get(
            reverse('foo-detail', kwargs={'pk': foo.pk}), None, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update(self):
        foo_data = {
            'foo': "bar"
        }

        self.client.force_authenticate(user=self.user)
        response = self.client.patch(
            reverse('foo-detail', kwargs={'pk': foo.pk}), foo_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_with_no_login(self):
        response = self.client.patch(
            reverse('foo-detail', kwargs={'pk': foo.pk}), None, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_destroy(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(
            reverse('foo-detail', kwargs={'pk': foo.pk}), None, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_destroy_with_no_login(self):
        response = self.client.delete(
            reverse('foo-detail', kwargs={'pk': foo.pk}), None, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
