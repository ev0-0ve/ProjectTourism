from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required

from .models import Tour, TourPlace
from guide.models import GuidePlace
from favorites.models import Favorite


@login_required
def tours_page(request):

    tours = Tour.objects.filter(
        user=request.user
    )

    selected_tour_id = request.session.get(
        'selected_tour'
    )

    selected_tour = None

    if selected_tour_id:
        selected_tour = Tour.objects.filter(
            id=selected_tour_id,
            user=request.user
        ).first()

    favorites = Favorite.objects.filter(
        user=request.user
    )

    return render(
        request,
        'tours/create_tour.html',
        {
            'tours': tours,
            'selected_tour': selected_tour,
            'favorites': favorites,
        }
    )


@login_required
def create_tour(request):

    count = Tour.objects.filter(
        user=request.user
    ).count() + 1

    tour = Tour.objects.create(
        user=request.user,
        title=f'Тур {count}'
    )

    request.session['selected_tour'] = tour.id

    return redirect('tours')


@login_required
def select_tour(request, tour_id):

    tour = get_object_or_404(
        Tour,
        id=tour_id,
        user=request.user
    )

    request.session['selected_tour'] = tour.id

    return redirect('tours')


@login_required
def add_to_tour(request, place_id):

    selected_tour_id = request.session.get(
        'selected_tour'
    )

    if not selected_tour_id:
        return redirect('tours')

    tour = get_object_or_404(
        Tour,
        id=selected_tour_id,
        user=request.user
    )

    place = get_object_or_404(
        GuidePlace,
        id=place_id
    )

    exists = TourPlace.objects.filter(
        tour=tour,
        place=place
    ).exists()

    if not exists:
        TourPlace.objects.create(
            tour=tour,
            place=place
        )

    return redirect('tours')


@login_required
def remove_from_tour(request, item_id):

    item = get_object_or_404(
        TourPlace,
        id=item_id,
        tour__user=request.user
    )

    item.delete()

    return redirect('tours')