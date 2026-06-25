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

    tour_places = []

    if selected_tour:

        for item in selected_tour.items.all():

            place = item.place

            if place.latitude and place.longitude:
                tour_places.append({
                    'title': place.title,
                    'lat': place.latitude,
                    'lng': place.longitude,
                })

    return render(
        request,
        'tours/create_tour.html',
        {
            'tours': tours,
            'selected_tour': selected_tour,
            'favorites': favorites,
            'tour_places': tour_places,
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

@login_required
def rename_tour(request, tour_id):

    tour = get_object_or_404(
        Tour,
        id=tour_id,
        user=request.user
    )

    if request.method == 'POST':

        title = request.POST.get('title')

        if title:
            tour.title = title
            tour.save()

    return redirect('tours')

@login_required
def delete_tour(request, tour_id):

    tour = get_object_or_404(
        Tour,
        id=tour_id,
        user=request.user
    )

    tour.delete()

    selected = request.session.get('selected_tour')

    if selected == tour_id:
        request.session['selected_tour'] = None

    return redirect('tours')

def similar_tours(request):
    return render(
        request,
        'tours/similar_tours.html'
    )

def flight_search(request):
    return render(
        request,
        'tours/flight_search.html'
    )


def hotel_booking(request):
    return render(
        request,
        'tours/hotel_booking.html'
    )