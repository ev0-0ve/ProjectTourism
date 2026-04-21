from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', auth_views.LoginView.as_view(template_name='users/login.html'), name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('profile/', views.profile_view, name='profile'),

    path('note/delete/<int:note_id>/', views.note_delete, name='note_delete'),
    path('ajax/check_email/', views.CheckEmailAjaxView.as_view(), name='ajax_check_email'),
]