from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import uuid

from app.database import get_db
from app.models import User
from app.schemas.location import EmergencyAlert, EmergencyResponse
from app.routers.auth import get_current_user

router = APIRouter()


@router.post("/alert", response_model=EmergencyResponse)
def send_emergency_alert(
    alert: EmergencyAlert,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Send emergency alert with user's location.
    In production, this would:
    - Notify campus security
    - Send SMS/push to emergency contacts
    - Log the incident
    """
    alert_id = str(uuid.uuid4())[:8]
    
    # For hackathon demo, just log and return success
    # In production: integrate with security systems, send notifications, etc.
    print(f"🚨 EMERGENCY ALERT from {current_user.name}")
    print(f"   Location: ({alert.lat}, {alert.lng})")
    print(f"   Message: {alert.message or 'No message'}")
    print(f"   Alert ID: {alert_id}")
    
    return EmergencyResponse(
        success=True,
        alert_id=alert_id,
        message="Emergency alert sent! Campus security has been notified."
    )


@router.get("/contacts")
def get_emergency_contacts():
    """Get campus emergency contact numbers."""
    return {
        "contacts": [
            {
                "name": "Campus Security",
                "phone": "+44 20 8411 5555",
                "available": "24/7"
            },
            {
                "name": "Student Support",
                "phone": "+44 20 8411 4444",
                "available": "9am - 5pm"
            },
            {
                "name": "Emergency Services",
                "phone": "999",
                "available": "24/7"
            }
        ]
    }
