# users/views.py
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    """POST /api/auth/register/ — create a new user"""
    queryset            = User.objects.all()
    serializer_class    = RegisterSerializer
    permission_classes  = [permissions.AllowAny]


class ProfileView(APIView):
    """GET /api/auth/profile/ — get logged-in user's info"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)