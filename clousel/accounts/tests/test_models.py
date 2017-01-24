import datetime

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.urlresolvers import reverse
from django.test import TestCase
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

from accounts.models import EmailUser, Profile


class EmailUserManagerTest(TestCase):

    def test_create_user(self):
        user = EmailUser.objects.create_user(
            email="miffy@example.com",
            password="dickbruna",
        )
        self.assertTrue(isinstance(user, EmailUser))
        self.assertTrue(isinstance(user.profile, Profile))
        self.assertFalse(user.is_admin)
        self.assertFalse(user.is_superuser)
        self.assertFalse(user.is_staff)

    def test_create_superuser(self):
        user = EmailUser.objects.create_superuser(
            email="miffy@example.com",
            password="dickbruna",
        )
        self.assertTrue(isinstance(user, EmailUser))
        self.assertTrue(isinstance(user.profile, Profile))
        self.assertTrue(user.is_admin)
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)

    def test_create_blank_email(self):
        with self.assertRaises(ValueError):
            EmailUser.objects.create_user(email='')


class EmailUserTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.user = EmailUser.objects.create_user(
            email='miffy@example.com', password='')

    def test_verbose_name_plural(self):
        self.assertEqual(
            str(EmailUser._meta.verbose_name_plural), "email users")

    def test_string_representation(self):
        self.assertEqual(str(self.user), self.user.email)

    def test_user_get_full_name(self):
        self.assertEqual(self.user.get_full_name(), self.user.email)

    def test_user_get_short_name(self):
        self.assertEqual(self.user.get_short_name(), self.user.email)

    def test_uniqueness(self):
        """
        EmailUserは．Emailが重複することを禁止しています．
        ゆえに，同じEmailを持つUserがすでにいる場合には，
        :func:`accounts.models.EmailUser.validate_unique()` でValidationErrorが発生します．
        ただし，同じEmailを持つUserのis_activeがFalseの場合，
        :func:`accounts.models.EmailUserManager._create_user()` でis_activeがFalseのUserが削除されるため，
        正常に登録することができます．

        このテストでは，上記の通りに動作しているか検証しています．
        """
        EmailUser.objects.create_user(
            email="nijntje.pluis@example.com",
            password="dickbruna",
            is_active=False
        )

        user1 = EmailUser(
            email="nijntje.pluis@example.com",
            password="dickbruna",
        )
        user1.full_clean()
        user1.save()

        user2 = EmailUser(
            email="nijntje.pluis@example.com",
            password="dickbruna",
        )
        with self.assertRaises(ValidationError):
            user2.full_clean()


class ProfileTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.user = EmailUser.objects.create_user(
            email='miffy@example.com', password='')

    def test_verbose_name_plural(self):
        self.assertEqual(str(Profile._meta.verbose_name_plural), "profiles")

    def test_string_representation(self):
        profile = Profile(user=self.user)
        self.assertEqual(str(profile), profile.user.email)
