from django import forms
from django.utils.translation import ugettext_lazy as _
from mptt.forms import TreeNodeChoiceField

from clothing.models import Category

from .models import UserItem


class UserItemForm(forms.ModelForm):
    category = TreeNodeChoiceField(
        queryset=Category.objects.all()
    )
    image = forms.ImageField(widget=forms.FileInput)
    has_bought = forms.BooleanField(label=_('This one is mine.'), label_suffix='', required=False)

    class Meta:
        model = UserItem
        fields = ('title', 'category', 'image', 'has_bought', )

    def save(self, user, commit=True, *args, **kwargs):
        user_item = super().save(commit=False, *args, **kwargs)
        user_item.owner = user
        if commit:
            user_item.save()
        return user_item
