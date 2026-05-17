from django import forms
from django.contrib.auth.models import User
from .models import Profile, Note

class UserRegisterForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput, label="Пароль")
    password_confirm = forms.CharField(widget=forms.PasswordInput, label="Подтвердите пароль")
    phone = forms.CharField(max_length=20, required=False, label="Телефон")
    avatar = forms.ImageField(required=False, label="Аватар")

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def clean_password_confirm(self):
        p1 = self.cleaned_data.get('password')
        p2 = self.cleaned_data.get('password_confirm')
        if p1 != p2:
            raise forms.ValidationError("Пароли не совпадают")
        return p2

class NoteForm(forms.ModelForm):
    class Meta:
        model = Note
        fields = ['title', 'text', 'image']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-input-glass figma-input',
                'placeholder': 'Заголовок'
            }),
            'text': forms.Textarea(attrs={
                'class': 'form-input-glass figma-input',
                'rows': 2,
                'placeholder': 'Начните ввод'
            }),
            'image': forms.FileInput(attrs={
                'class': 'form-file-input'
            }),
        }

class UserUpdateForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'email']
        widgets = {
            'username': forms.TextInput(attrs={'class': 'figma-input'}),
            'email': forms.EmailInput(attrs={'class': 'figma-input'}),
        }

class ProfileUpdateForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['phone', 'avatar']
        widgets = {
            'phone': forms.TextInput(attrs={'class': 'figma-input'}),
        }