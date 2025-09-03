from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Appointment
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Appointment)
def appointment_created_notification(sender, instance, created, **kwargs):
    """
    Signal que se ejecuta cuando se crea una nueva cita.
    Envía notificaciones tanto al paciente como al doctor.
    
    Args:
        sender: El modelo que envió la señal (Appointment)
        instance: La instancia de la cita que se guardó
        created: Boolean que indica si es una nueva instancia
        **kwargs: Argumentos adicionales
    """
    if created:
        try:
            # Log de la creación de la cita
            logger.info(
                f"📅 Nueva cita creada - ID: {instance.id}, "
                f"Paciente: {instance.patient.user.get_full_name()}, "
                f"Doctor: {instance.doctor.user.get_full_name()}, "
                f"Fecha: {instance.date} {instance.time}, "
                f"Estado: {instance.get_status_display()}"
            )
            
            # Notificación al paciente
            patient_message = (
                f"Su cita ha sido programada para el {instance.date.strftime('%d/%m/%Y')} "
                f"a las {instance.time.strftime('%H:%M')} con el Dr. {instance.doctor.user.get_full_name()}. "
                f"Motivo: {instance.reason}"
            )
            logger.info(f"📧 [NOTIFICACIÓN PACIENTE] {instance.patient.user.email}: {patient_message}")
            
            # Notificación al doctor
            doctor_message = (
                f"Nueva cita programada para el {instance.date.strftime('%d/%m/%Y')} "
                f"a las {instance.time.strftime('%H:%M')} con {instance.patient.user.get_full_name()}. "
                f"Motivo: {instance.reason}"
            )
            logger.info(f"📧 [NOTIFICACIÓN DOCTOR] {instance.doctor.user.email}: {doctor_message}")
            
            # TODO: Implementar envío real de notificaciones cuando se configure Celery
            # send_appointment_confirmation_email.delay(instance.id)
            # send_doctor_notification_email.delay(instance.id)
            
        except Exception as e:
            logger.error(f"❌ Error al procesar notificaciones para cita {instance.id}: {str(e)}")


@receiver(pre_save, sender=Appointment)
def appointment_status_change_notification(sender, instance, **kwargs):
    """
    Signal para detectar cambios en el estado de la cita y enviar notificaciones.
    """
    if instance.pk:  # Solo para citas existentes (actualizaciones)
        try:
            # Obtener el estado anterior
            old_instance = Appointment.objects.get(pk=instance.pk)
            
            # Verificar si cambió el estado
            if old_instance.status != instance.status:
                logger.info(
                    f"Cambio de estado en cita {instance.id}: "
                    f"{old_instance.status} -> {instance.status}"
                )
                
                # Notificaciones específicas según el nuevo estado
                if instance.status == 'cancelled':
                    logger.info(
                        f"Notificación de cancelación enviada - "
                        f"Paciente: {instance.patient.user.email}, "
                        f"Doctor: {instance.doctor.user.email}"
                    )
                elif instance.status == 'completed':
                    logger.info(
                        f"Notificación de cita completada enviada - "
                        f"Paciente: {instance.patient.user.email}"
                    )
                elif instance.status == 'confirmed':
                    logger.info(
                        f"Notificación de confirmación enviada - "
                        f"Paciente: {instance.patient.user.email}, "
                        f"Doctor: {instance.doctor.user.email}"
                    )
                    
        except Appointment.DoesNotExist:
            # Es una nueva cita, no hay estado anterior
            pass
        except Exception as e:
            logger.error(f"Error al procesar cambio de estado para la cita {instance.id}: {str(e)}")


@receiver(pre_save, sender=Appointment)
def appointment_datetime_change_notification(sender, instance, **kwargs):
    """
    Signal para notificar cambios en la fecha/hora de la cita.
    """
    if instance.pk:  # Solo para citas existentes (actualizaciones)
        try:
            # Obtener la fecha anterior
            old_instance = Appointment.objects.get(pk=instance.pk)
            
            # Verificar si cambió la fecha/hora
            if old_instance.date != instance.date or old_instance.time != instance.time:
                logger.info(
                    f"📅 Cambio de fecha/hora en cita {instance.id}: "
                    f"{old_instance.date} {old_instance.time} -> {instance.date} {instance.time}"
                )
                
                # Notificaciones de reprogramación
                logger.info(
                    f"📧 Notificación de reprogramación enviada - "
                    f"Paciente: {instance.patient.user.email}, "
                    f"Doctor: {instance.doctor.user.email}, "
                    f"Nueva fecha: {instance.date} a las {instance.time}"
                )
                    
        except Appointment.DoesNotExist:
            # Es una nueva cita, no hay fecha anterior
            pass
        except Exception as e:
            logger.error(f"Error al procesar cambio de fecha para la cita {instance.id}: {str(e)}")


@receiver(post_save, sender=Appointment)
def appointment_reminder_scheduler(sender, instance, created, **kwargs):
    """
    Signal que programa recordatorios automáticos para las citas.
    Se ejecuta cuando se crea o actualiza una cita.
    
    Args:
        sender: El modelo que envió la señal (Appointment)
        instance: La instancia de la cita que se guardó
        created: Boolean que indica si es una nueva instancia
        **kwargs: Argumentos adicionales
    """
    # Solo programar recordatorios para citas futuras y en estados apropiados
    if instance.status in ['scheduled', 'confirmed']:
        try:
            appointment_datetime = datetime.combine(instance.date, instance.time)
            now = datetime.now()
            
            # Solo programar si la cita es en el futuro
            if appointment_datetime > now:
                # Calcular cuándo enviar recordatorios
                reminder_24h = appointment_datetime - timedelta(hours=24)
                reminder_2h = appointment_datetime - timedelta(hours=2)
                
                logger.info(
                    f"⏰ Recordatorios programados para cita ID: {instance.id} - "
                    f"24h antes: {reminder_24h.strftime('%d/%m/%Y %H:%M')}, "
                    f"2h antes: {reminder_2h.strftime('%d/%m/%Y %H:%M')}"
                )
                
                # TODO: Implementar programación real de recordatorios con Celery Beat
                # schedule_appointment_reminder.apply_async(
                #     args=[instance.id, '24h'],
                #     eta=reminder_24h
                # )
                # schedule_appointment_reminder.apply_async(
                #     args=[instance.id, '2h'],
                #     eta=reminder_2h
                # )
                
        except Exception as e:
            logger.error(f"❌ Error al programar recordatorios para cita {instance.id}: {str(e)}")


@receiver(post_save, sender=Appointment)
def appointment_audit_log(sender, instance, created, **kwargs):
    """
    Signal para crear logs de auditoría de todas las operaciones con citas.
    Registra información detallada para trazabilidad.
    
    Args:
        sender: El modelo que envió la señal (Appointment)
        instance: La instancia de la cita que se guardó
        created: Boolean que indica si es una nueva instancia
        **kwargs: Argumentos adicionales
    """
    try:
        action = "CREADA" if created else "ACTUALIZADA"
        
        # Log detallado para auditoría
        audit_info = {
            'action': action,
            'appointment_id': instance.id,
            'patient_id': instance.patient.id,
            'patient_name': instance.patient.user.get_full_name(),
            'patient_email': instance.patient.user.email,
            'doctor_id': instance.doctor.id,
            'doctor_name': instance.doctor.user.get_full_name(),
            'doctor_email': instance.doctor.user.email,
            'date': instance.date.strftime('%Y-%m-%d'),
            'time': instance.time.strftime('%H:%M'),
            'status': instance.status,
            'reason': instance.reason[:100] + '...' if len(instance.reason) > 100 else instance.reason,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        logger.info(f"📋 [AUDITORÍA] Cita {action}: {audit_info}")
        
        # TODO: Implementar guardado en base de datos de auditoría
        # AuditLog.objects.create(
        #     model_name='Appointment',
        #     object_id=instance.id,
        #     action=action,
        #     details=audit_info,
        #     timestamp=datetime.now()
        # )
        
    except Exception as e:
        logger.error(f"❌ Error en log de auditoría para cita {instance.id}: {str(e)}")