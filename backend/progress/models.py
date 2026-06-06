# progress/models.py
from django.db import models
from django.conf import settings
from capsules.models import Article
from quizzes.models import Quiz

class ArticleProgress(models.Model):
    """Tracks which articles a user has read"""
    user       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    article    = models.ForeignKey(Article, on_delete=models.CASCADE)
    read_at    = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'article')

    def __str__(self):
        return f"{self.user.username} read {self.article.title}"


class QuizScore(models.Model):
    """Stores a user's quiz result"""
    user       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    quiz       = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score      = models.IntegerField()       # number of correct answers
    total      = models.IntegerField()       # total questions
    taken_at   = models.DateTimeField(auto_now_add=True)

    def percentage(self):
        return round((self.score / self.total) * 100) if self.total > 0 else 0

    def __str__(self):
        return f"{self.user.username} scored {self.score}/{self.total} on {self.quiz.title}"