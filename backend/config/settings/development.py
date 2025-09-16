"""Development settings for config project."""

from .base import *
from decouple import config

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY', default='django-insecure-t#fkef&44+2d-y257r4n@v8)06!=@&ol7&rag@5+$rc#pd)#z=')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=True, cast=bool)

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1', cast=lambda v: [s.strip() for s in v.split(',')])

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Development-specific settings
INTERNAL_IPS = [
    '127.0.0.1',
    'localhost',
]

# Email backend for development (console) - COMENTADO para usar Gmail SMTP
# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Authentication Backends
AUTHENTICATION_BACKENDS = [
    'apps.users.backends.EmailOrUsernameModelBackend',
    'django.contrib.auth.backends.ModelBackend',  # Fallback
]

# Logging configuration for development
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}