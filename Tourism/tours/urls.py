from django.urls import path
from . import views

urlpatterns = [
    path(
        '',
        views.tours_page,
        name='tours'
    ),

    path(
        'create/',
        views.create_tour,
        name='create_tour'
    ),

    path(
        'select/<int:tour_id>/',
        views.select_tour,
        name='select_tour'
    ),

    path(
        'add/<int:place_id>/',
        views.add_to_tour,
        name='add_to_tour'
    ),

    path(
        'remove/<int:item_id>/',
        views.remove_from_tour,
        name='remove_from_tour'
    ),

    path(
        'rename/<int:tour_id>/',
        views.rename_tour,
        name='rename_tour'
    ),

    path(
        'delete/<int:tour_id>/',
        views.delete_tour,
        name='delete_tour'
    ),
]