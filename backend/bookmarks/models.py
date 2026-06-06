# bookmarks/models.py
from django.db import models
from django.conf import settings
from capsules.models import Article

class Bookmark(models.Model):
    """Saves an article for a user"""
    user       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookmarks')
    article    = models.ForeignKey(Article, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'article')  # can't bookmark same article twice

    def __str__(self):
        return f"{self.user.username} → {self.article.title}"