# bookmarks/views.py
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Bookmark
from .serializers import BookmarkSerializer

class BookmarkListView(generics.ListAPIView):
    """GET /api/bookmarks/ — list current user's bookmarks"""
    serializer_class   = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Bookmark.objects.filter(user=self.request.user)


class BookmarkToggleView(APIView):
    """POST /api/bookmarks/toggle/<article_id>/ — add or remove bookmark"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, article_id):
        bookmark, created = Bookmark.objects.get_or_create(
            user=request.user,
            article_id=article_id
        )
        if not created:
            # already bookmarked → remove it
            bookmark.delete()
            return Response({'bookmarked': False, 'message': 'Bookmark removed'})
        return Response({'bookmarked': True, 'message': 'Bookmark added'}, status=201)