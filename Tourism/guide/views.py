from django.shortcuts import render
from .models import GuidePlace


def guide(request):
    places = GuidePlace.objects.all()

    return render(request, 'guide/guide.html', {
        'places': places
    })