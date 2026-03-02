from django.shortcuts import render
from .forms import ProfileForm

# Методы для main.urls

def home(request):
    return render(request, 'main/home.html')

def about(request):
    return render(request, 'main/about.html')

def guide(request):
    return render(request, 'main/guide.html')

def events(request):
    return render(request, 'main/events.html')

def create_tour(request):
    return render(request, 'main/create_tour.html')

def favorites(request):
    return render(request, 'main/favorites.html')

def profile(request):
    data = None

    if request.method == "POST":
        form = ProfileForm(request.POST, request.FILES)
        if form.is_valid():
            data = form.cleaned_data
    else:
        form = ProfileForm()

    return render(request, 'main/profile.html', {
        'form': form,
        'data': data
    })
