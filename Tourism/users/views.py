from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import logout, update_session_auth_hash
from django.contrib.auth.decorators import login_required
from .forms import UserRegisterForm, NoteForm
from .models import Note, Profile  # Добавили Profile сюда
from django.views.generic import DetailView

# ФУНКЦИЯ РЕГИСТРАЦИИ (которой не хватало)
def register(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.save()
            # Создаем профиль для нового пользователя
            Profile.objects.create(
                user=user,
                phone=form.cleaned_data.get('phone'),
                avatar=form.cleaned_data.get('avatar')
            )
            return redirect('login')
    else:
        form = UserRegisterForm()
    return render(request, 'users/register.html', {'form': form})

# ЛОГИКА ПРОФИЛЯ
@login_required
def profile_view(request):
    if request.method == 'POST':
        # 1. Если добавляем заметку
        if 'add_note' in request.POST:
            form = NoteForm(request.POST, request.FILES)
            if form.is_valid():
                note = form.save(commit=False)
                note.author = request.user
                note.save()
                return redirect('profile')

        # 2. Если обновляем данные профиля
        elif 'update_profile' in request.POST:
            user = request.user
            profile = user.profile

            user.username = request.POST.get('username', user.username)
            user.email = request.POST.get('email', user.email)
            profile.phone = request.POST.get('phone', profile.phone)

            if 'avatar' in request.FILES:
                profile.avatar = request.FILES['avatar']

            # Смена пароля
            old_pass = request.POST.get('old_password')
            new_pass = request.POST.get('new_password')
            if old_pass and new_pass:
                if user.check_password(old_pass):
                    user.set_password(new_pass)
                    update_session_auth_hash(request, user)

            user.save()
            profile.save()
            return redirect('profile')

    form = NoteForm()
    notes = request.user.notes.filter(removed=False).order_by('-created_at')
    return render(request, 'users/profile.html', {'notes': notes, 'form': form})

# УДАЛЕНИЕ ЗАМЕТКИ
@login_required
def note_delete(request, note_id):
    note = get_object_or_404(Note, id=note_id, author=request.user)
    note.removed = True
    note.save()
    return redirect('profile')

# ВЫХОД
def user_logout(request):
    logout(request)
    return redirect('login')