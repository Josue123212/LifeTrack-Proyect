#!/usr/bin/env python
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from apps.users.models import User
from apps.patients.models import Patient

def debug_user_permissions():
    """Debug de permisos del usuario"""
    print("=== DEBUG USER PERMISSIONS ===")
    
    try:
        # Buscar usuario por email
        user = User.objects.get(email='josue@gmail.com')
        print(f"Usuario encontrado: {user.username} (ID: {user.id})")
        print(f"Role: {user.role}")
        print(f"Is staff: {user.is_staff}")
        print(f"Is superuser: {user.is_superuser}")
        
        # Verificar si tiene patient_profile
        print(f"\nVerificando patient_profile:")
        if hasattr(user, 'patient_profile'):
            patient_profile = user.patient_profile
            print(f"  - Tiene patient_profile: SÍ")
            print(f"  - Patient ID: {patient_profile.id}")
            print(f"  - Patient name: {patient_profile.full_name}")
        else:
            print(f"  - Tiene patient_profile: NO")
            
        # Verificar si tiene doctor_profile
        print(f"\nVerificando doctor_profile:")
        if hasattr(user, 'doctor_profile'):
            doctor_profile = user.doctor_profile
            print(f"  - Tiene doctor_profile: SÍ")
            print(f"  - Doctor ID: {doctor_profile.id}")
        else:
            print(f"  - Tiene doctor_profile: NO")
            
        # Buscar paciente con ID 51
        print(f"\n=== VERIFICANDO PACIENTE ID 51 ===")
        try:
            patient = Patient.objects.get(id=51)
            print(f"Paciente encontrado: {patient.full_name}")
            print(f"Usuario asociado: {patient.user.username} (ID: {patient.user.id})")
            
            # Verificar si son el mismo
            if hasattr(user, 'patient_profile'):
                same_patient = user.patient_profile == patient
                print(f"¿Es el mismo paciente? {same_patient}")
            else:
                print("Usuario no tiene patient_profile para comparar")
                
        except Patient.DoesNotExist:
            print("Paciente con ID 51 no encontrado")
            
    except User.DoesNotExist:
        print("Usuario josue@gmail.com no encontrado")

if __name__ == '__main__':
    debug_user_permissions()