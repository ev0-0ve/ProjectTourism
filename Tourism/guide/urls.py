from django.urls import path
from . import views

urlpatterns = [
    path('', views.guide, name='guide'),
]