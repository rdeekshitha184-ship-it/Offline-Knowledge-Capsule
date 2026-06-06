# quizzes/views.py
from rest_framework import generics, permissions
from .models import Quiz
from .serializers import QuizSerializer

class QuizListView(generics.ListAPIView):
    """GET /api/quizzes/ — list quizzes, filter by category"""
    serializer_class   = QuizSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Quiz.objects.all()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__id=category)
        return queryset


class QuizDetailView(generics.RetrieveAPIView):
    """GET /api/quizzes/<id>/ — single quiz with all questions"""
    queryset           = Quiz.objects.all()
    serializer_class   = QuizSerializer
    permission_classes = [permissions.AllowAny]