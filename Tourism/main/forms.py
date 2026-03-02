from django import forms
from django.forms import DateInput

Contry_Choices = ( (1, "Австралия"), (2, "Австрия"), (3, "Белоруссия"),
                   (4, "Болгария"), (5, "Вьетнам"), (6, "Италия"),
                   (7, "Россия"), (8, "Швеция"), (9, "Япония"), )

class ProfileForm(forms.Form):
    username = forms.CharField(
        label="Имя пользователя",
        max_length=50,
        required=True
    )

    password = forms.CharField(
        label="Пароль",
        widget=forms.PasswordInput,
        required=True
    )

    email = forms.EmailField(
        label="Email",
        required=True
    )

    avatar = forms.ImageField( # pip install Pillow
        label="Аватар",
        required=False
    )

    born = forms.DateField(
        label="Дата рождения",
        widget=DateInput(attrs={ 'type' : 'date'}),
        required=True
    )

    contry =forms.TypedChoiceField(
        label="Страна проживания",
        choices=Contry_Choices, coerce=str
    )

    agree = forms.BooleanField(
        label="Согласие с правилами",
        required=True
    )
