from django import template
from django.forms.fields import CheckboxInput, Select

register = template.Library()

@register.filter(name='is_checkbox')
def is_checkbox(value):
    return isinstance(value, CheckboxInput)

@register.filter(name='is_select')
def is_checkbox(value):
    return isinstance(value, Select)

@register.filter(name='hash')
def hash(h, key):
    return h[key]