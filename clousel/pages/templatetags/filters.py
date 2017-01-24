from django import template
from django.forms import FileInput
from django.forms.fields import CheckboxInput, Select

from accounts.forms import DateDropdownWidget

register = template.Library()


@register.filter(name='is_file')
def is_file(value):
    return isinstance(value, FileInput)


@register.filter(name='is_checkbox')
def is_checkbox(value):
    return isinstance(value, CheckboxInput)


@register.filter(name='is_select')
def is_checkbox(value):
    return isinstance(value, Select)


@register.filter(name='is_date_dropdown')
def is_checkbox(value):
    return isinstance(value, DateDropdownWidget)


@register.filter(name='is_list')
def is_checkbox(value):
    return isinstance(value, list)


@register.filter(name='hash')
def hash(h, key):
    return h[key]
