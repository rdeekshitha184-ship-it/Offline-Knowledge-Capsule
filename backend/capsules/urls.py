# capsules/urls.py
from django.urls import path
from .views import (CategoryListView, ArticleListView,
                    ArticleDetailView, RelatedArticlesView)

urlpatterns = [
    path('categories/',                       CategoryListView.as_view(),   name='categories'),
    path('articles/',                         ArticleListView.as_view(),    name='articles'),
    path('articles/<int:pk>/',                ArticleDetailView.as_view(),  name='article-detail'),
    path('articles/<int:pk>/related/',        RelatedArticlesView.as_view(),name='related-articles'),
]