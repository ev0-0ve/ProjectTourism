from django.shortcuts import render

# Методы для main.urls

def home(request):
    return render(request, 'main/home.html')

def about(request):
    return render(request, 'main/about.html')

def guide(request):
    return render(request, 'main/guide.html')

def create_tour(request):
    return render(request, 'main/create_tour.html')

def favorites(request):
    return render(request, 'main/favorites.html')