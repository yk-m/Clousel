from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .forms import (EmailUserChangeFormForAdmin, EmailUserCreationForm,
                    ProfileForm)
from .models import EmailUser, Profile


class ProfileInline(admin.StackedInline):
    model = Profile
    add_form = ProfileForm


class EmailUserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = EmailUserChangeFormForAdmin
    add_form = EmailUserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('email', 'is_admin', )
    list_filter = ('is_admin', )
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('is_admin', )}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2')}
         ),
    )
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ()
    inlines = (ProfileInline, )


# Now register the new UserAdmin...
admin.site.register(EmailUser, EmailUserAdmin)


@admin.register(Profile)
class Profile(admin.ModelAdmin):
    pass
