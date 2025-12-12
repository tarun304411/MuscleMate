from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model, authenticate, login, logout


@api_view(["GET"])
@permission_classes([AllowAny])
def ping(request):
    return Response({"status": "ok"})


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    User = get_user_model()
    username = (request.data.get("username") or "").strip()
    email = (request.data.get("email") or "").strip()
    password = request.data.get("password") or ""

    if not username or not password:
        return Response({"detail": "username and password required"}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({"detail": "username already exists"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    login(request, user)
    return Response({"status": "ok"}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def session_login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(request, username=username, password=password)
    if not user:
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
    login(request, user)
    return Response({"status": "ok"})


@api_view(["POST"])
def session_logout(request):
    logout(request)
    return Response({"status": "ok"})

# Create your views here.
