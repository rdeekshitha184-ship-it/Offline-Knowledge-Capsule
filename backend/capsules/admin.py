from django.contrib import admin
from .models import Category, Article

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon', 'color']

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display  = ['title', 'category', 'reading_time', 'created_at']
    list_filter   = ['category']
    search_fields = ['title', 'content', 'tags']