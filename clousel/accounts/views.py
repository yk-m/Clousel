from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.utils.translation import ugettext_lazy as _

from .forms import EmailUserChangeForm, ProfileForm
from .models import Profile


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
def detail_view(request):
    return render(request, 'accounts/detail.html')


@login_required
def edit_view(request):
    user = request.user
    if not hasattr(user, 'profile'):
        profile = Profile.objects.create(user=user)
    else:
        profile = user.profile

    if request.method == 'POST':
        form = ProfileForm(request.POST, instance=profile, prefix="profile")
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(reverse('accounts:detail'))
    else:
        form = ProfileForm(instance=profile, prefix="profile")

    return render(request, 'accounts/edit.html', {'form': form})


@login_required
def delete_view(request):
    user = request.user
    user.is_active = False
    user.save()
    logout(request)
    return HttpResponseRedirect(reverse('pages:index'))
