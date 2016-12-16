from django.contrib.sites.models import Site

one = Site.objects.all()[0]
one.domain = 'clousel.com'
one.name = 'Clousel'
one.save()