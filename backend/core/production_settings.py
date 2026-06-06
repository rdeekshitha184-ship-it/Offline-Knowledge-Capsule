# core/production_settings.py
from .settings import *
import dj_database_url
from decouple import config

DEBUG = False

SECRET_KEY = config('SECRET_KEY')

ALLOWED_HOSTS = ['*']

# WhiteNoise serves static files in production
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')

# Database from environment variable
DATABASES = {
    'default': dj_database_url.config(
        default=config('DATABASE_URL')
    )
}

# Static files
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# CORS for production — allow your Vercel frontend
CORS_ALLOWED_ORIGINS = [
    config('FRONTEND_URL', default='http://localhost:3000'),
]
CORS_ALLOW_ALL_ORIGINS = True