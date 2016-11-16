import datetime

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase
from django.utils.translation import ugettext_lazy as _

from accounts.forms import (EmailUserChangeForm, EmailUserCreationForm,
                            ProfileForm)


class EmailUserCreationFormTest(TestCase):

    Form = EmailUserCreationForm

    def test_init(self):
        self.Form()

    def test_valid_data(self):
        form = self.Form({
            'email': "miffy@example.com",
            'password1': "dickbruna",
            'password2': "dickbruna"
        })
        self.assertTrue(form.is_valid())
        user = form.save()
        self.assertEqual(user.email, "miffy@example.com")

    def test_blank_data(self):
        form = self.Form({})
        self.assertFalse(form.is_valid())
        self.assertTrue(form.has_error('email', code='required'))
        self.assertTrue(form.has_error('password1', code='required'))
        self.assertTrue(form.has_error('password2', code='required'))

    def test_different_password(self):
        form = self.Form({
            'email': "miffy@example.com",
            'password1': "dickbruna_01",
            'password2': "dickbruna_02"
        })
        self.assertFalse(form.is_valid())
        self.assertTrue(form.has_error('password2', code='password_mismatch'))

    def test_short_password(self):
        """
        `MinimumLengthValidator <https://docs.djangoproject.com/ja/1.10/topics/auth/passwords/#django.contrib.auth.password_validation.MinimumLengthValidator>`_
        が正常に動作しているか検証しています．

        Options:
            min_length: 8
        """
        form = self.Form({
            'email': "miffy@example.com",
            'password1': "bruna",
            'password2': "bruna"
        })
        self.assertFalse(form.is_valid())
        self.assertTrue(form.has_error('password2', code='password_too_short'))

    def test_similar_password(self):
        """
        `UserAttributeSimilarityValidator <https://docs.djangoproject.com/ja/1.10/topics/auth/passwords/#django.contrib.auth.password_validation.UserAttributeSimilarityValidator>`_
        が正常に動作しているか検証しています．

        Options:
            user_attributes: ('email', )
        """
        form = self.Form({
            'email': "miffy@example.com",
            'password1': "miffy_example",
            'password2': "miffy_example"
        })
        self.assertFalse(form.is_valid())
        self.assertTrue(form.has_error(
            'password2', code='password_too_similar'))

    def test_common_password(self):
        """
        `CommonPasswordValidator <https://docs.djangoproject.com/ja/1.10/topics/auth/passwords/#django.contrib.auth.password_validation.CommonPasswordValidator>`_
        が正常に動作しているか検証しています．
        """
        form = self.Form({
            'email': "miffy@example.com",
            'password1': "password",
            'password2': "password"
        })
        self.assertFalse(form.is_valid())
        self.assertTrue(form.has_error(
            'password2', code='password_too_common'))

    def test_numeric_password(self):
        """
        `NumericPasswordValidator <https://docs.djangoproject.com/ja/1.10/topics/auth/passwords/#django.contrib.auth.password_validation.NumericPasswordValidator>`_
        が正常に動作しているか検証しています．
        """
        form = self.Form({
            'email': "miffy@example.com",
            'password1': "31415926535",
            'password2': "31415926535"
        })
        self.assertFalse(form.is_valid())
        self.assertTrue(form.has_error(
            'password2', code='password_entirely_numeric'))


class EmailUserChangeFormTest(TestCase):

    Form = EmailUserChangeForm

    @classmethod
    def setUpTestData(cls):
        User = get_user_model()
        cls.user = User.objects.create_user(
            email='miffy@example.com', password='')

    def test_init(self):
        self.Form(instance=self.user)

    def test_init_without_instance(self):
        with self.assertRaises(KeyError):
            self.Form()

    def test_valid_data(self):
        form = self.Form({
            'email': "nijntje.pluis@example.com"
        }, instance=self.user)
        self.assertTrue(form.is_valid())
        user = form.save()
        self.assertEqual(user.email, "nijntje.pluis@example.com")

    def test_blank_data(self):
        form = self.Form({}, instance=self.user)
        self.assertFalse(form.is_valid())
        self.assertTrue(form.has_error('email', code='required'))


class ProfileFormTest(TestCase):

    Form = ProfileForm

    @classmethod
    def setUpTestData(cls):
        User = get_user_model()
        cls.user = User.objects.create_user(
            email='miffy@example.com', password='')

    def test_init(self):
        self.Form(user=self.user)

    def test_init_without_user(self):
        with self.assertRaises(KeyError):
            self.Form()

    def test_valid_data(self):
        form = self.Form({
            'name': "Miffy",
            'date_of_birth': datetime.date(1955, 1, 1)
        }, user=self.user)
        self.assertTrue(form.is_valid())
        profile = form.save()
        self.assertEqual(profile.name, "Miffy")
        self.assertEqual(profile.date_of_birth, datetime.date(1955, 1, 1))

    def test_blank_data(self):
        form = self.Form({}, user=self.user)
        self.assertTrue(form.is_valid())
        profile = form.save()
        self.assertEqual(profile.name, "")
        self.assertEqual(profile.date_of_birth, None)
