from django.shortcuts import render
from django.http import HttpResponse

# Методы для main.urls

def index(request):
    return render(request, 'main/index.html')

def about(request):
    return render(request, 'main/about.html')

def guide(request):
    return render(request, 'main/guide.html')   # создайте шаблон guide.html (может наследовать layout)

def events(request):
    return render(request, 'main/events.html')

def home(request):
    return render(request, 'main/home.html')

def create_tour(request):
    return render(request, 'main/create_tour.html')

def favorites(request):
    return render(request, 'main/favorites.html')
