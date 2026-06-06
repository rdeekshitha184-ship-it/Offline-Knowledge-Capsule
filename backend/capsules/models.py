# capsules/models.py
from django.db import models

class Category(models.Model):
    """Represents one of the 6 learning capsules"""
    ICON_CHOICES = [
        ('brain', 'Brain'),
        ('heart', 'Heart'),
        ('briefcase', 'Briefcase'),
        ('star', 'Star'),
        ('landmark', 'Landmark'),
        ('flask', 'Flask'),
    ]
    name        = models.CharField(max_length=100)
    description = models.TextField()
    icon        = models.CharField(max_length=50, choices=ICON_CHOICES)
    color       = models.CharField(max_length=20, default='#3B82F6')  # hex color
    order       = models.IntegerField(default=0)  # display order

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['order']

    def __str__(self):
        return self.name


class Article(models.Model):
    """An article belonging to a capsule/category"""
    category     = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='articles')
    title        = models.CharField(max_length=200)
    content      = models.TextField()
    summary      = models.TextField(blank=True)      # short preview text
    image        = models.ImageField(upload_to='articles/', blank=True, null=True)
    tags         = models.CharField(max_length=300, blank=True)  # comma-separated
    reading_time = models.IntegerField(default=3)    # in minutes
    is_featured  = models.BooleanField(default=False)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title