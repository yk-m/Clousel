from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.utils.translation import ugettext_lazy as _


class EmailUserManager(BaseUserManager):

    def _create_user(self, email, password, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError(_('The given email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_admin', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_admin', True)

        if extra_fields.get('is_admin') is not True:
            raise ValueError('Superuser must have is_admin=True.')

        return self._create_user(email, password, **extra_fields)


class EmailUser(AbstractBaseUser):
    """
    ``settings.AUTH_USER_MODEL`` に設定してあるモデルです．

    Djangoのデフォルトは **Username + Password** による認証ですが，
    **Email + Password** による認証を行いたかったため追加しました．

    .. note::
        モジュールの再利用の観点から，Userモデルとして直接参照することはおすすめしません．

        Userモデルを取得したい際には， ``settings.AUTH_USER_MODEL``
        または ``django.contrib.auth.get_user_model()`` を利用してください．
    """

    email = models.EmailField(
        verbose_name=_("Email address"),
        max_length=255,
        unique=True,
    )
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = EmailUserManager()
    USERNAME_FIELD = 'email'

    class Meta:
        verbose_name = 'Email User'
        verbose_name_plural = 'email users'

    def get_full_name(self):
        return self.email

    def get_short_name(self):
        return self.email

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, perm, obj=None):
        return self.is_staff

    @property
    def is_superuser(self):
        return self.is_admin

    @property
    def is_staff(self):
        return self.is_admin

    def validate_unique(self, exclude=None):
        """Validate the field uniqueness"""
        EmailUser.objects.filter(email=self.email, is_active=False).delete()
        super(EmailUser, self).validate_unique(exclude)


class Profile(models.Model):
    '''
    ユーザに関する付加的な情報を保持するためのモデルです．

    将来的にユーザの生年月日や性別を加味した推薦を行う可能性を考慮し作成してあります．

    .. note::
        今のところはどこにも使われていません．
    '''

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, blank=True)
    date_of_birth = models.DateField(blank=True, null=True)

    class Meta:
        verbose_name = 'Profile'
        verbose_name_plural = 'profiles'

    def __str__(self):
        return self.user.email
