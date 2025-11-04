"""Core tasks for Celery."""

import time
from celery import shared_task
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

@shared_task
def test_celery_task():
    """Simple test task to verify Celery is working."""
    logger.info("Test Celery task started")
    time.sleep(2)  # Simulate some work
    logger.info("Test Celery task completed")
    return "Celery test task completed successfully!"

@shared_task
def add_numbers(x, y):
    """Simple math task for testing."""
    logger.info(f"Adding {x} + {y}")
    result = x + y
    logger.info(f"Result: {result}")
    return result

@shared_task
def send_notification_email(subject, message, recipient_list):
    """Send notification email task."""
    try:
        logger.info(f"Sending email to {recipient_list}")
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipient_list,
            fail_silently=False,
        )
        logger.info("Email sent successfully")
        return f"Email sent to {len(recipient_list)} recipients"
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        raise

@shared_task
def log_system_status():
    """Log system status - useful for monitoring."""
    current_time = timezone.now()
    logger.info(f"System status check at {current_time}")
    
    # Simulate system checks
    status = {
        'timestamp': current_time.isoformat(),
        'celery_worker': 'running',
        'database': 'connected',
        'redis': 'connected'
    }
    
    logger.info(f"System status: {status}")
    return status

@shared_task
def cleanup_old_data():
    """Cleanup old data - example of maintenance task."""
    logger.info("Starting cleanup of old data")
    
    # This is a placeholder for actual cleanup logic
    # In a real application, you would clean up old logs,
    # expired sessions, temporary files, etc.
    
    cleaned_items = 0
    logger.info(f"Cleanup completed. Removed {cleaned_items} items")
    return f"Cleanup completed. Removed {cleaned_items} items"

@shared_task(bind=True)
def long_running_task(self, duration=10):
    """Example of a long-running task with progress updates."""
    logger.info(f"Starting long running task for {duration} seconds")
    
    for i in range(duration):
        time.sleep(1)
        # Update task progress
        self.update_state(
            state='PROGRESS',
            meta={'current': i + 1, 'total': duration}
        )
        logger.info(f"Progress: {i + 1}/{duration}")
    
    logger.info("Long running task completed")
    return {'current': duration, 'total': duration, 'status': 'Task completed!'}

# =============================================================================
# APPOINTMENT EMAIL NOTIFICATION TASKS
# =============================================================================

@shared_task
def send_appointment_confirmation_email(appointment_data):
    """
    Send appointment confirmation email to patient.
    
    Args:
        appointment_data (dict): Dictionary containing appointment information
            - patient_email: Patient's email address
            - patient_name: Patient's full name
            - doctor_name: Doctor's full name
            - doctor_specialty: Doctor's specialty
            - appointment_date: Date of appointment
            - appointment_time: Time of appointment
            - clinic_address: Clinic address (optional)
            - clinic_phone: Clinic phone (optional)
            - appointment_notes: Special notes (optional)
            - reschedule_url: URL to reschedule (optional)
            - cancel_url: URL to cancel (optional)
    """
    try:
        logger.info(f"Sending appointment confirmation to {appointment_data.get('patient_email')}")
        
        # Render HTML email template
        html_message = render_to_string('emails/appointment_confirmation.html', {
            'patient_name': appointment_data.get('patient_name'),
            'doctor_name': appointment_data.get('doctor_name'),
            'doctor_specialty': appointment_data.get('doctor_specialty'),
            'appointment_date': appointment_data.get('appointment_date'),
            'appointment_time': appointment_data.get('appointment_time'),
            'clinic_address': appointment_data.get('clinic_address'),
            'clinic_phone': appointment_data.get('clinic_phone'),
            'appointment_notes': appointment_data.get('appointment_notes'),
            'reschedule_url': appointment_data.get('reschedule_url'),
            'cancel_url': appointment_data.get('cancel_url'),
            'show_actions': appointment_data.get('show_actions', True),
            'preparation_instructions': appointment_data.get('preparation_instructions'),
        })
        
        # Create plain text version
        plain_message = strip_tags(html_message)
        
        # Send email
        from django.core.mail import EmailMultiAlternatives
        
        subject = f"Confirmación de Cita - {appointment_data.get('appointment_date')}"
        
        email = EmailMultiAlternatives(
            subject=subject,
            body=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[appointment_data.get('patient_email')]
        )
        email.attach_alternative(html_message, "text/html")
        email.send()
        
        logger.info("Appointment confirmation email sent successfully")
        return f"Confirmation email sent to {appointment_data.get('patient_email')}"
        
    except Exception as e:
        logger.error(f"Failed to send appointment confirmation email: {str(e)}")
        raise

@shared_task
def send_appointment_reminder_email(appointment_data):
    """
    Send appointment reminder email to patient.
    
    Args:
        appointment_data (dict): Dictionary containing appointment information
            - patient_email: Patient's email address
            - patient_name: Patient's full name
            - doctor_name: Doctor's full name
            - doctor_specialty: Doctor's specialty
            - appointment_date: Date of appointment
            - appointment_time: Time of appointment
            - clinic_address: Clinic address (optional)
            - clinic_phone: Clinic phone (optional)
            - preparation_instructions: Special preparation (optional)
            - fasting_required: Boolean for fasting requirement (optional)
            - fasting_hours: Hours of fasting required (optional)
            - fasting_start_time: Time to start fasting (optional)
            - confirm_url: URL to confirm attendance (optional)
            - reschedule_url: URL to reschedule (optional)
            - cancel_url: URL to cancel (optional)
            - emergency_phone: Emergency contact phone (optional)
    """
    try:
        logger.info(f"Sending appointment reminder to {appointment_data.get('patient_email')}")
        
        # Render HTML email template
        html_message = render_to_string('emails/appointment_reminder.html', {
            'patient_name': appointment_data.get('patient_name'),
            'doctor_name': appointment_data.get('doctor_name'),
            'doctor_specialty': appointment_data.get('doctor_specialty'),
            'appointment_date': appointment_data.get('appointment_date'),
            'appointment_time': appointment_data.get('appointment_time'),
            'clinic_address': appointment_data.get('clinic_address'),
            'clinic_phone': appointment_data.get('clinic_phone'),
            'preparation_instructions': appointment_data.get('preparation_instructions'),
            'fasting_required': appointment_data.get('fasting_required', False),
            'fasting_hours': appointment_data.get('fasting_hours'),
            'fasting_start_time': appointment_data.get('fasting_start_time'),
            'confirm_url': appointment_data.get('confirm_url'),
            'reschedule_url': appointment_data.get('reschedule_url'),
            'cancel_url': appointment_data.get('cancel_url'),
            'show_actions': appointment_data.get('show_actions', True),
            'emergency_phone': appointment_data.get('emergency_phone'),
        })
        
        # Create plain text version
        plain_message = strip_tags(html_message)
        
        # Send email
        from django.core.mail import EmailMultiAlternatives
        
        subject = f"Recordatorio de Cita - Mañana {appointment_data.get('appointment_time')}"
        
        email = EmailMultiAlternatives(
            subject=subject,
            body=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[appointment_data.get('patient_email')]
        )
        email.attach_alternative(html_message, "text/html")
        email.send()
        
        logger.info("Appointment reminder email sent successfully")
        return f"Reminder email sent to {appointment_data.get('patient_email')}"
        
    except Exception as e:
        logger.error(f"Failed to send appointment reminder email: {str(e)}")
        raise

@shared_task
def send_appointment_cancellation_email(appointment_data):
    """
    Send appointment cancellation email to patient.
    
    Args:
        appointment_data (dict): Dictionary containing appointment information
            - patient_email: Patient's email address
            - patient_name: Patient's full name
            - doctor_name: Doctor's full name
            - doctor_specialty: Doctor's specialty
            - appointment_date: Original date of appointment
            - appointment_time: Original time of appointment
            - cancellation_date: Date when cancelled
            - cancellation_reason: Reason for cancellation (optional)
            - cancelled_by_patient: Boolean indicating who cancelled (optional)
            - refund_info: Refund information (optional)
            - reschedule_url: URL to reschedule (optional)
            - available_slots_url: URL to see available slots (optional)
            - suggested_dates: List of suggested alternative dates (optional)
            - contact_phone: Contact phone for assistance (optional)
            - contact_email: Contact email for assistance (optional)
            - feedback_url: URL for feedback (optional)
    """
    try:
        logger.info(f"Sending appointment cancellation to {appointment_data.get('patient_email')}")
        
        # Render HTML email template
        html_message = render_to_string('emails/appointment_cancellation.html', {
            'patient_name': appointment_data.get('patient_name'),
            'doctor_name': appointment_data.get('doctor_name'),
            'doctor_specialty': appointment_data.get('doctor_specialty'),
            'appointment_date': appointment_data.get('appointment_date'),
            'appointment_time': appointment_data.get('appointment_time'),
            'cancellation_date': appointment_data.get('cancellation_date', timezone.now()),
            'cancellation_reason': appointment_data.get('cancellation_reason'),
            'cancelled_by_patient': appointment_data.get('cancelled_by_patient', False),
            'refund_info': appointment_data.get('refund_info'),
            'show_reschedule_options': appointment_data.get('show_reschedule_options', True),
            'reschedule_url': appointment_data.get('reschedule_url'),
            'available_slots_url': appointment_data.get('available_slots_url'),
            'suggested_dates': appointment_data.get('suggested_dates'),
            'contact_info': appointment_data.get('contact_info', True),
            'contact_phone': appointment_data.get('contact_phone'),
            'contact_email': appointment_data.get('contact_email'),
            'feedback_url': appointment_data.get('feedback_url'),
        })
        
        # Create plain text version
        plain_message = strip_tags(html_message)
        
        # Send email
        from django.core.mail import EmailMultiAlternatives
        
        subject = f"Cancelación de Cita - {appointment_data.get('appointment_date')}"
        
        email = EmailMultiAlternatives(
            subject=subject,
            body=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[appointment_data.get('patient_email')]
        )
        email.attach_alternative(html_message, "text/html")
        email.send()
        
        logger.info("Appointment cancellation email sent successfully")
        return f"Cancellation email sent to {appointment_data.get('patient_email')}"
        
    except Exception as e:
        logger.error(f"Failed to send appointment cancellation email: {str(e)}")
        raise

@shared_task
def send_bulk_appointment_reminders():
    """
    Send reminder emails for all appointments scheduled for tomorrow.
    This task should be run daily via Celery Beat.
    """
    try:
        from django.utils import timezone
        from datetime import timedelta
        
        # Calculate tomorrow's date
        tomorrow = timezone.now().date() + timedelta(days=1)
        
        logger.info(f"Sending bulk reminders for appointments on {tomorrow}")
        
        # This would typically query the Appointment model
        # For now, we'll just log the action
        # TODO: Implement when Appointment model is available
        
        logger.info("Bulk reminder task completed")
        return f"Bulk reminders processed for {tomorrow}"
        
    except Exception as e:
        logger.error(f"Failed to send bulk reminders: {str(e)}")
        raise