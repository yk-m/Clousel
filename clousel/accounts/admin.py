from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
# from django.contrib.auth.models import User as BaseUser

# from accounts.models import User

# # Define an inline admin descriptor for Customer model
# class UserInline(admin.StackedInline):
# 	model = User
# 	can_delete = False
# 	verbose_name_plural = 'users'

# # Define a new User admin
# class UserAdmin(BaseUserAdmin):
# 	inlines = (UserInline, )

# # Re-register UserAdmin
# admin.site.unregister(BaseUser)
# admin.site.register(BaseUser, UserAdmin)