from django.shortcuts import render, redirect
from .forms import UserRegisterForm, NoteForm
from .models import Profile
from django.contrib.auth import logout

def register(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST, request.FILES)
        if form.is_valid():
            # 1. Сохраняем пользователя
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.save()
            # 2. Создаем профиль и привязываем к пользователю
            Profile.objects.create(
                user=user,
                phone=form.cleaned_data['phone'],
                avatar=form.cleaned_data['avatar']
            )
            return redirect('login')
    else:
        form = UserRegisterForm()
    return render(request, 'users/register.html', {'form': form})

def profile_view(request):
    if request.method == 'POST':
        form = NoteForm(request.POST, request.FILES)
        if form.is_valid():
            note = form.save(commit=False)
            note.author = request.user  # Привязываем заметку к текущему юзеру
            note.save()
            return redirect('profile') # Перезагружаем страницу после сохранения
    else:
        form = NoteForm()

    notes = request.user.notes.all().order_by('-created_at') # Новые сверху
    return render(request, 'users/profile.html', {'notes': notes, 'form': form})

def user_logout(request):
    logout(request)
    return redirect('home')