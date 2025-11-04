import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

try:
    import apps.patients
    print('patients: OK')
except Exception as e:
    print(f'patients: ERROR - {e}')

try:
    import apps.doctors
    print('doctors: OK')
except Exception as e:
    print(f'doctors: ERROR - {e}')

try:
    import apps.appointments
    print('appointments: OK')
except Exception as e:
    print(f'appointments: ERROR - {e}')