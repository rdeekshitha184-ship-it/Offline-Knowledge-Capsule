# bookmarks/urls.py
from django.urls import path
from .views import BookmarkListView, BookmarkToggleView

urlpatterns = [
    path('bookmarks/',                          BookmarkListView.as_view(),   name='bookmarks'),
    path('bookmarks/toggle/<int:article_id>/',  BookmarkToggleView.as_view(), name='bookmark-toggle'),
]