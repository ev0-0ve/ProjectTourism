from django.db import models
from django.contrib.auth.models import User

# Таблица 2: Профиль (связь 1-к-1 с User)
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name="Пользователь")
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True, verbose_name="Аватар")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Телефон")
    bio = models.TextField(blank=True, verbose_name="О пользователе")

    def __str__(self):
        return f"Профиль {self.user.username}"

    class Meta:
        verbose_name = 'Профиль'
        verbose_name_plural = 'Профили'

# Таблица 3: Заметки (связь 1-ко-многим с User)
class Note(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')
    title = models.CharField(max_length=200, verbose_name="Заголовок")
    text = models.TextField(verbose_name="Текст заметки")
    image = models.ImageField(upload_to='notes/', blank=True, null=True, verbose_name="Фото к заметке")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Заметка'
        verbose_name_plural = 'Заметки'