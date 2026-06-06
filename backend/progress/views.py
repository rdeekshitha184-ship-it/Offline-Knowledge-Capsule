# progress/views.py
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import ArticleProgress, QuizScore
from .serializers import ArticleProgressSerializer, QuizScoreSerializer

class MarkArticleReadView(APIView):
    """POST /api/progress/read/<article_id>/ — mark article as read"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, article_id):
        progress, created = ArticleProgress.objects.get_or_create(
            user=request.user,
            article_id=article_id
        )
        serializer = ArticleProgressSerializer(progress)
        return Response(serializer.data, status=201 if created else 200)


class SubmitQuizScoreView(APIView):
    """POST /api/progress/quiz/ — save quiz result"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = QuizScoreSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class UserProgressView(APIView):
    """GET /api/progress/ — full progress summary for dashboard"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        read_articles = ArticleProgress.objects.filter(user=request.user)
        quiz_scores   = QuizScore.objects.filter(user=request.user)
        return Response({
            'articles_read'  : ArticleProgressSerializer(read_articles, many=True).data,
            'quiz_scores'    : QuizScoreSerializer(quiz_scores, many=True).data,
            'total_read'     : read_articles.count(),
            'total_quizzes'  : quiz_scores.count(),
        })