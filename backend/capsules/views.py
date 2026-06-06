# capsules/views.py
from django.db import models as db_models
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Category, Article
from .serializers import CategorySerializer, ArticleSerializer


class CategoryListView(generics.ListAPIView):
    """GET /api/categories/ — list all 6 capsules"""
    queryset           = Category.objects.all()
    serializer_class   = CategorySerializer
    permission_classes = [permissions.AllowAny]


class ArticleListView(generics.ListAPIView):
    """GET /api/articles/ — list articles, filter by category or search"""
    serializer_class   = ArticleSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Article.objects.all()
        category = self.request.query_params.get('category')
        search   = self.request.query_params.get('search')
        featured = self.request.query_params.get('featured')

        if category:
            queryset = queryset.filter(category__id=category)

        if search:
            queryset = queryset.filter(
                db_models.Q(title__icontains=search)           |
                db_models.Q(content__icontains=search)         |
                db_models.Q(tags__icontains=search)            |
                db_models.Q(summary__icontains=search)         |
                db_models.Q(category__name__icontains=search)
            ).distinct()

        if featured:
            queryset = queryset.filter(is_featured=True)

        return queryset


class ArticleDetailView(generics.RetrieveAPIView):
    """GET /api/articles/<id>/ — single article"""
    queryset           = Article.objects.all()
    serializer_class   = ArticleSerializer
    permission_classes = [permissions.AllowAny]


class RelatedArticlesView(APIView):
    """GET /api/articles/<id>/related/ — same category articles"""
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        try:
            article = Article.objects.get(pk=pk)
            related = Article.objects.filter(
                category=article.category
            ).exclude(pk=pk)[:4]
            serializer = ArticleSerializer(related, many=True)
            return Response(serializer.data)
        except Article.DoesNotExist:
            return Response([], status=404)