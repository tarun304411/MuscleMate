from django.urls import path
from .views import ping, register, session_login, session_logout


urlpatterns = [
    path('ping/', ping),
    path('register/', register),
    path('session-login/', session_login),
    path('session-logout/', session_logout),
]


