from django import template

from clothing.models import Clothing

register = template.Library()


# @register.filter
# def call_repr(obj):
#     return repr(obj)