from django.urls import path
from . import views

urlpatterns = [

    path('', views.favorites, name='favorites'),

    path(
        'add/<int:place_id>/',
        views.add_favorite,
        name='add_favorite'
    ),
    
    path(
        'remove/<int:place_id>/',
        views.remove_favorite,
        name='remove_favorite'
    ),
]