from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.utils.translation import ugettext_lazy as _


def login_view(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            login(request, user)
            # Redirect to a success page.
            return HttpResponse(_("success"))
        else:
            # Return a 'disabled account' error message
            HttpResponse(_("disabled account"))
    else:
        # Return an 'invalid login' error message.
        HttpResponse(_("invalid login"))


@login_required
def dashboard_view(request):
    return render(request, 'accounts/dashboard.html')