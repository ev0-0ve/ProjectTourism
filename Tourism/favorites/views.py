from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from guide.models import GuidePlace

from .models import Favorite

@login_required
def favorites(request):

    favorites = Favorite.objects.filter(user=request.user)

    return render(request, 'favorites/favorites.html', {
        'favorites': favorites
    })

@login_required
def add_favorite(request, place_id):

    place = get_object_or_404(
        GuidePlace,
        id=place_id
    )

    favorite_exists = Favorite.objects.filter(
        user=request.user,
        guide=place
    ).exists()

    if not favorite_exists:

        Favorite.objects.create(
            user=request.user,
            guide=place
        )

    return redirect('guide')

@login_required
def remove_favorite(request, place_id):

    favorite = Favorite.objects.filter(
        user=request.user,
        guide_id=place_id
    )

    favorite.delete()

    return redirect('favorites')