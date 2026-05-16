from django.shortcuts import render

def create_tour(request):
    return render(request, 'tours/create_tour.html')

def add_to_tour(request, place_id):
    from django.shortcuts import redirect
    return redirect('guide')
