from django import forms


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

    avatar = forms.ImageField(
        label="Аватар",
        required=False
    )

    agree = forms.BooleanField(
        label="Согласие с правилами",
        required=True
    )