from django.shortcuts import render
from django.http import HttpResponse

# Методы для main.urls

def index(request):
    return HttpResponse("<h4>Hello World</h4>")

def about(request):
    return HttpResponse("<h4>Страница про нас</h4>")
