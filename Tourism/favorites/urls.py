from django.urls import path
from . import views

urlpatterns = [
    # Список избранного пользователя
    path('', views.favorites, name='favorites'),
]