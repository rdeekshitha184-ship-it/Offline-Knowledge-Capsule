# progress/serializers.py
from rest_framework import serializers
from .models import ArticleProgress, QuizScore

class ArticleProgressSerializer(serializers.ModelSerializer):
    article_title = serializers.CharField(source='article.title', read_only=True)

    class Meta:
        model  = ArticleProgress
        fields = ['id', 'article', 'article_title', 'read_at']


class QuizScoreSerializer(serializers.ModelSerializer):
    quiz_title  = serializers.CharField(source='quiz.title', read_only=True)
    percentage  = serializers.SerializerMethodField()

    class Meta:
        model  = QuizScore
        fields = ['id', 'quiz', 'quiz_title', 'score', 'total', 'percentage', 'taken_at']

    def get_percentage(self, obj):
        return obj.percentage()