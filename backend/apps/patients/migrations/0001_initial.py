# Generated manually for patients app

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Patient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('phone', models.CharField(blank=True, max_length=20, null=True, verbose_name='Teléfono')),
                ('address', models.TextField(blank=True, null=True, verbose_name='Dirección')),
                ('birth_date', models.DateField(blank=True, null=True, verbose_name='Fecha de nacimiento')),
                ('gender', models.CharField(choices=[('M', 'Masculino'), ('F', 'Femenino'), ('O', 'Otro')], max_length=1, verbose_name='Género')),
                ('emergency_contact_name', models.CharField(blank=True, max_length=100, null=True, verbose_name='Contacto de emergencia')),
                ('emergency_contact_phone', models.CharField(blank=True, max_length=20, null=True, verbose_name='Teléfono de emergencia')),
                ('medical_history', models.TextField(blank=True, null=True, verbose_name='Historial médico')),
                ('allergies', models.TextField(blank=True, null=True, verbose_name='Alergias')),
                ('current_medications', models.TextField(blank=True, null=True, verbose_name='Medicamentos actuales')),
                ('insurance_provider', models.CharField(blank=True, max_length=100, null=True, verbose_name='Proveedor de seguro')),
                ('insurance_number', models.CharField(blank=True, max_length=50, null=True, verbose_name='Número de seguro')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='Fecha de creación')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Fecha de actualización')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='patient_profile', to=settings.AUTH_USER_MODEL, verbose_name='Usuario')),
            ],
            options={
                'verbose_name': 'Paciente',
                'verbose_name_plural': 'Pacientes',
                'ordering': ['-created_at'],
            },
        ),
    ]