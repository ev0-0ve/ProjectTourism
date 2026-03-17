from django.shortcuts import render
from .models import Event  # модель для событий

def events_home(request):
    events = Event.objects.all()  # получаем все события из БД
    return render(request, 'events/events_home.html', {'events': events})