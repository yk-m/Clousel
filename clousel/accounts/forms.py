import datetime

from django import forms
from django.contrib.auth import get_user_model, password_validation
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.utils.translation import ugettext_lazy as _

from .models import EmailUser, Profile


class EmailUserCreationForm(forms.ModelForm):
    """A form for creating new users. Includes all the required
    fields, plus a repeated password."""
    required_css_class = 'p-formset__field--required'
    password1 = forms.CharField(
        label=_('Password'),
        widget=forms.PasswordInput,
        help_text=password_validation.password_validators_help_text_html(),
    )
    password2 = forms.CharField(
        label=_('Password confirmation'),
        widget=forms.PasswordInput,
        help_text=_("Enter the same password as before, for verification."),
    )

    class Meta:
        model = get_user_model()
        fields = ('email', )

    def clean_password1(self):
        password1 = self.cleaned_data.get("password1")
        self.instance.email = self.cleaned_data.get('email')
        password_validation.validate_password(
            self.cleaned_data.get('password1'), self.instance)
        return password1

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError(
                _("The two password fields didn't match."),
                code='password_mismatch',
            )
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super(EmailUserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class EmailUserChangeForm(forms.ModelForm):
    """A form for updating users."""

    class Meta:
        model = get_user_model()
        fields = ('email', )

    def __init__(self, *args, **kwargs):
        instance = kwargs['instance']   # instanceがない場合はKeyError
        super().__init__(*args, **kwargs)


class EmailUserChangeFormForAdmin(EmailUserChangeForm):
    """
    A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    password hash display field.
    """
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = get_user_model()
        fields = ('email', 'password', 'is_active', )

    def clean_password(self):
        # Regardless of what the user provides, return the initial value.
        # This is done here, rather than on the field, because the
        # field does not have access to the initial value
        return self.initial["password"]


class DateDropdownWidget(forms.MultiWidget):

    def __init__(self, attrs=None, year_range=None, month_range=None, day_range=None):
        YEARS = year_range or range(1900, datetime.date.today().year)[::-1]
        MONTHES = month_range or range(1,13)
        DAYS = day_range or range(1,32)

        years = map( lambda x: (x,x), YEARS )
        months = map(lambda x:(x,x), MONTHES )
        days = map( lambda x: (x,x), DAYS )

        widgets = (
                forms.Select(choices=years),
                forms.Select(choices=months),
                forms.Select(choices=days),
                )
        super(DateDropdownWidget, self).__init__(widgets, attrs)

    def format_output(self,widgets):
        format = """
            <div class="p-formset__datefield">
                <label class="c-select">%s</label>
                <label class="c-select">%s</label>
                <label class="c-select">%s</label>
            </div>
        """
        return format % (widgets[0], widgets[1], widgets[2])

    def decompress(self,value):
        if value:
            return [value.year, value.month, value.day]
        return [None,None,None]


class DateField(forms.MultiValueField):
    widget = DateDropdownWidget

    def __init__(self,*args,**kwargs):
        fields = (
                forms.IntegerField( required=True),
                forms.IntegerField( required=True),
                forms.IntegerField( required=True ),
                )
        super(DateField, self).__init__(fields, *args, **kwargs )

    def compress(self, data_list):
        EMPTY_VALUES = [None, '']
        ERROR_EMPTY = "Fill the fields."
        ERROR_INVALID = "Enter a valid date."
        if data_list:
            if list(filter(lambda x: x in EMPTY_VALUES, data_list)):
                raise forms.ValidationError(ERROR_EMPTY)

            try:
                return datetime.datetime(*map(lambda x:int(x),data_list))
            except ValueError:
                raise forms.ValidationError(ERROR_INVALID)
        return None


class ProfileForm(forms.ModelForm):
    date_of_birth = DateField()

    class Meta:
        model = Profile
        fields = ('name', 'date_of_birth', )

    def __init__(self, *args, **kwargs):
        instance = kwargs['instance']   # instanceがない場合はKeyError
        super().__init__(*args, **kwargs)


