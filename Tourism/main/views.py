from django.shortcuts import render

# Методы для main.urls

def home(request):
    return render(request, 'main/home.html')

def about(request):
    return render(request, 'main/about.html')