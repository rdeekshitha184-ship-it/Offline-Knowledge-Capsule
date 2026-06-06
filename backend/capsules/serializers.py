# capsules/serializers.py
from rest_framework import serializers
from .models import Category, Article

class CategorySerializer(serializers.ModelSerializer):
    article_count = serializers.SerializerMethodField()
    quiz_count    = serializers.SerializerMethodField()

    class Meta:
        model  = Category
        fields = ['id', 'name', 'description', 'icon', 'color', 'order',
                  'article_count', 'quiz_count']

    def get_article_count(self, obj):
        return obj.articles.count()

    def get_quiz_count(self, obj):
        return obj.quizzes.count()


class ArticleSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_color = serializers.CharField(source='category.color', read_only=True)

    class Meta:
        model  = Article
        fields = ['id', 'title', 'summary', 'content', 'category', 'category_name',
                  'category_color', 'image', 'tags', 'reading_time',
                  'is_featured', 'created_at']