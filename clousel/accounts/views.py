from django.contrib.auth import authenticate, login
from django.shortcuts import render


def login_view(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            login(request, user)
            # Redirect to a success page.
            return HttpResponse("success")
        else:
            # Return a 'disabled account' error message
            HttpResponse("disabled account")
    else:
        # Return an 'invalid login' error message.
        HttpResponse("invalid login")
