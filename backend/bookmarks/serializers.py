# bookmarks/serializers.py
from rest_framework import serializers
from .models import Bookmark
from capsules.serializers import ArticleSerializer

class BookmarkSerializer(serializers.ModelSerializer):
    article_detail = ArticleSerializer(source='article', read_only=True)

    class Meta:
        model  = Bookmark
        fields = ['id', 'article', 'article_detail', 'created_at']