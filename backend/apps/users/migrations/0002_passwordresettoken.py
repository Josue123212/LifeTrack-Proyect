# Generated manually for PasswordResetToken model

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PasswordResetToken',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token', models.CharField(help_text='Token único para la recuperación de contraseña', max_length=64, unique=True, verbose_name='Token')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')),
                ('expires_at', models.DateTimeField(help_text='Fecha y hora cuando expira el token', verbose_name='Fecha de expiración')),
                ('used', models.BooleanField(default=False, help_text='Indica si el token ya fue utilizado', verbose_name='Usado')),
                ('ip_address', models.GenericIPAddressField(blank=True, help_text='IP desde donde se solicitó la recuperación', null=True, verbose_name='Dirección IP')),
                ('user_agent', models.TextField(blank=True, help_text='Información del navegador/dispositivo', verbose_name='User Agent')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='password_reset_tokens', to=settings.AUTH_USER_MODEL, verbose_name='Usuario')),
            ],
            options={
                'verbose_name': 'Token de Recuperación de Contraseña',
                'verbose_name_plural': 'Tokens de Recuperación de Contraseña',
                'ordering': ['-created_at'],
            },
        ),
        migrations.AddIndex(
            model_name='passwordresettoken',
            index=models.Index(fields=['token'], name='users_passwordresettoken_token_idx'),
        ),
        migrations.AddIndex(
            model_name='passwordresettoken',
            index=models.Index(fields=['user', 'used'], name='users_passwordresettoken_user_used_idx'),
        ),
        migrations.AddIndex(
            model_name='passwordresettoken',
            index=models.Index(fields=['expires_at'], name='users_passwordresettoken_expires_at_idx'),
        ),
    ]