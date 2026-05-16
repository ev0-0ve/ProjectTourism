from django.urls import path
from . import views

urlpatterns = [
    path('create_tour/', views.create_tour, name='create_tour'),
    # Добавление места в тур
    path('add-place/<int:place_id>/', views.add_to_tour, name='add_to_tour'),
]