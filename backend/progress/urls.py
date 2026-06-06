# progress/urls.py
from django.urls import path
from .views import MarkArticleReadView, SubmitQuizScoreView, UserProgressView

urlpatterns = [
    path('progress/',                          UserProgressView.as_view(),    name='progress'),
    path('progress/read/<int:article_id>/',    MarkArticleReadView.as_view(), name='mark-read'),
    path('progress/quiz/',                     SubmitQuizScoreView.as_view(), name='quiz-score'),
]