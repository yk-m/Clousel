from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

from accounts.models import Customer

# Define an inline admin descriptor for Customer model
class CustomerInline(admin.StackedInline):
	model = Customer
	can_delete = False
	verbose_name_plural = 'customer'

# Define a new User admin
class UserAdmin(BaseUserAdmin):
	inlines = (CustomerInline, )

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)