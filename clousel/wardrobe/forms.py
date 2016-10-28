from django import forms
from django.forms.widgets import Select
from django.utils.translation import ugettext_lazy as _

from mptt.forms import TreeNodeChoiceField
from clothing.models import Category
from .models import UserItem


class WrappedSelect(Select):

    def render(self, name, value, attrs=None):
        return '<label class="c-select">%s</label>' % super().render(name, value, attrs=None)


class UserItemForm(forms.ModelForm):
    category = TreeNodeChoiceField(
        widget = WrappedSelect(attrs={'class': 'c-select'}),
        queryset=Category.objects.all()
    )

    class Meta:
        model = UserItem
        fields = ('image', 'category', 'has_bought', )

    def save(self, user, commit=True, *args, **kwargs):
        # category = kwargs.pop('category','')
        user_image = super().save(commit=False, *args, **kwargs)
        user_image.owner = user
        if commit:
            user_image.save()
        return user_image
