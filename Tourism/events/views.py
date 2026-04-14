from django.shortcuts import render
from django.views.generic import DetailView
from .models import Event  # модель для событий

def events_home(request):
    events = Event.objects.all()  # получаем все события из БД
    return render(request, 'events/events_home.html', {'events': events})

class EventDetailView(DetailView):
    model = Event
    template_name = 'events/event_detail.html'
    context_object_name = 'event'