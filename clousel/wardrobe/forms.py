from django import forms
from django.forms.widgets import Select
from django.utils.translation import ugettext_lazy as _
from mptt.forms import TreeNodeChoiceField

from clothing.models import Category

from .models import UserItem


class WrappedSelect(Select):
    """SelectをLabelでラッピングするためのウィジェットです．"""

    def render(self, name, value, attrs=None):
        return '<label class="c-select">%s</label>' % super().render(name, value, attrs=None)


class UserItemForm(forms.ModelForm):
    category = TreeNodeChoiceField(
        widget=WrappedSelect(attrs={'class': 'c-select'}),
        queryset=Category.objects.all()
    )

    class Meta:
        model = UserItem
        fields = ('title', 'category', 'image', 'has_bought', )

    def save(self, user, commit=True, *args, **kwargs):
        user_item = super().save(commit=False, *args, **kwargs)
        user_item.owner = user
        if commit:
            user_item.save()
        return user_item
