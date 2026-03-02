from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('about', views.about, name='about'),

    path('guide', views.guide, name='guide'),
    path('events', views.events, name='events'),
    path('home', views.home, name='home'),
    path('create_tour', views.create_tour, name='create_tour'),
    path('favorites', views.favorites, name='favorites'),
]