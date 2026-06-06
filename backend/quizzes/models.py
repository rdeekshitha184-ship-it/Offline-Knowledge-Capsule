# quizzes/models.py
from django.db import models
from capsules.models import Category

class Quiz(models.Model):
    """A quiz belonging to a capsule"""
    category    = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='quizzes')
    title       = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Quizzes'

    def __str__(self):
        return self.title


class Question(models.Model):
    """An MCQ question inside a quiz"""
    ANSWER_CHOICES = [('A','A'), ('B','B'), ('C','C'), ('D','D')]

    quiz           = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    question_text  = models.TextField()
    option_a       = models.CharField(max_length=300)
    option_b       = models.CharField(max_length=300)
    option_c       = models.CharField(max_length=300)
    option_d       = models.CharField(max_length=300)
    correct_answer = models.CharField(max_length=1, choices=ANSWER_CHOICES)
    explanation    = models.TextField(blank=True)  # shown after answering

    def __str__(self):
        return f"Q: {self.question_text[:60]}"