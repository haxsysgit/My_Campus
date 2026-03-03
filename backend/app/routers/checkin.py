from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models import User, Class, Checkin, Enrollment
from app.schemas.checkin import QRCheckinRequest, CheckinResponse, CheckinStatus
from app.routers.auth import get_current_user

router = APIRouter()


def verify_qr_code(qr_code: str) -> tuple[bool, str]:
    """
    Verify QR code is valid.
    Format: CAMPUS:CLASS_CODE:DATE:SECRET
    Returns: (is_valid, class_code)
    """
    parts = qr_code.split(":")
    if len(parts) < 2:
        return False, ""
    
    if parts[0] != "CAMPUS":
        return False, ""
    
    class_code = parts[1]
    
    # For hackathon demo, allow any date or simplified codes
    # In production, verify date matches today
    if len(parts) >= 3:
        today = datetime.now().strftime("%Y-%m-%d")
        if parts[2] != today and parts[2] != "DEMO":
            return False, ""
    
    return True, class_code


@router.post("/qr", response_model=CheckinResponse)
def qr_checkin(
    request: QRCheckinRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Check in to a class via QR code scan."""
    is_valid, class_code = verify_qr_code(request.qr_code)
    
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid QR code format")
    
    # Find the class
    cls = db.query(Class).filter(Class.code == class_code).first()
    if not cls:
        raise HTTPException(status_code=404, detail=f"Class {class_code} not found")
    
    # Check if user is enrolled
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.class_id == cls.id
    ).first()
    if not enrollment:
        raise HTTPException(status_code=403, detail="Not enrolled in this class")
    
    # Check if already checked in today
    today_start = datetime.now().replace(hour=0, minute=0, second=0)
    existing = db.query(Checkin).filter(
        Checkin.user_id == current_user.id,
        Checkin.class_id == cls.id,
        Checkin.checked_in_at >= today_start
    ).first()
    
    if existing:
        return CheckinResponse(
            success=True,
            message=f"Already checked in to {cls.name}",
            class_id=cls.id,
            checked_in_at=existing.checked_in_at
        )
    
    # Create check-in
    checkin = Checkin(
        user_id=current_user.id,
        class_id=cls.id,
        method="qr"
    )
    db.add(checkin)
    db.commit()
    db.refresh(checkin)
    
    return CheckinResponse(
        success=True,
        message=f"Checked in to {cls.name}!",
        class_id=cls.id,
        checked_in_at=checkin.checked_in_at
    )


@router.get("/status/{class_id}", response_model=CheckinStatus)
def get_checkin_status(
    class_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Check if user is already checked in to a class today."""
    today_start = datetime.now().replace(hour=0, minute=0, second=0)
    checkin = db.query(Checkin).filter(
        Checkin.user_id == current_user.id,
        Checkin.class_id == class_id,
        Checkin.checked_in_at >= today_start
    ).first()
    
    return CheckinStatus(
        checked_in=checkin is not None,
        checked_in_at=checkin.checked_in_at if checkin else None
    )
