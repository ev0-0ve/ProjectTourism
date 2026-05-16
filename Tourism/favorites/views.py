from django.shortcuts import render


def favorites(request):
    return render(request, 'favorites/favorites.html')

def toggle_favorite(request, place_id):
    # Пока просто редирект обратно
    from django.shortcuts import redirect
    return redirect('guide')