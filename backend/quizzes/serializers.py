# quizzes/serializers.py
from rest_framework import serializers
from .models import Quiz, Question

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Question
        fields = ['id', 'question_text', 'option_a', 'option_b',
                  'option_c', 'option_d', 'correct_answer', 'explanation']


class QuizSerializer(serializers.ModelSerializer):
    questions      = QuestionSerializer(many=True, read_only=True)
    category_name  = serializers.CharField(source='category.name', read_only=True)
    question_count = serializers.SerializerMethodField()

    class Meta:
        model  = Quiz
        fields = ['id', 'title', 'description', 'category', 'category_name',
                  'question_count', 'questions']

    def get_question_count(self, obj):
        return obj.questions.count()