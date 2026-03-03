from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.models import User, Class, Enrollment, Checkin
from app.schemas.class_ import ClassResponse, ClassDetailResponse, Headcount, StudentInClass
from app.routers.auth import get_current_user

router = APIRouter()


def get_initials(name: str) -> str:
    """Get initials from a name."""
    parts = name.split()
    if len(parts) >= 2:
        return f"{parts[0][0]}{parts[-1][0]}".upper()
    return name[:2].upper() if name else "??"


@router.get("/", response_model=List[ClassResponse])
def get_user_classes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all classes for the current user."""
    classes = db.query(Class).join(Enrollment).filter(
        Enrollment.user_id == current_user.id
    ).order_by(Class.day_of_week, Class.start_time).all()
    
    result = []
    for cls in classes:
        headcount = db.query(Checkin).filter(
            Checkin.class_id == cls.id,
            Checkin.checked_in_at >= datetime.now().replace(hour=0, minute=0, second=0)
        ).count()
        
        result.append(ClassResponse(
            id=cls.id,
            code=cls.code,
            name=cls.name,
            room=cls.room,
            start_time=cls.start_time,
            end_time=cls.end_time,
            building_id=cls.building_id,
            day_of_week=cls.day_of_week,
            total_students=cls.total_students,
            headcount=Headcount(checked_in=headcount, total=cls.total_students)
        ))
    
    return result


@router.get("/today", response_model=List[ClassResponse])
def get_today_classes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all classes for today for the current user."""
    today = datetime.now().weekday()  # 0=Monday
    
    classes = db.query(Class).join(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Class.day_of_week == today
    ).order_by(Class.start_time).all()
    
    result = []
    for cls in classes:
        headcount = db.query(Checkin).filter(
            Checkin.class_id == cls.id,
            Checkin.checked_in_at >= datetime.now().replace(hour=0, minute=0, second=0)
        ).count()
        
        result.append(ClassResponse(
            id=cls.id,
            code=cls.code,
            name=cls.name,
            room=cls.room,
            start_time=cls.start_time,
            end_time=cls.end_time,
            building_id=cls.building_id,
            day_of_week=cls.day_of_week,
            total_students=cls.total_students,
            headcount=Headcount(checked_in=headcount, total=cls.total_students)
        ))
    
    return result


@router.get("/{class_id}", response_model=ClassDetailResponse)
def get_class_detail(
    class_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get detailed class info including checked-in students."""
    cls = db.query(Class).filter(Class.id == class_id).first()
    if not cls:
        raise HTTPException(status_code=404, detail="Class not found")
    
    # Check if user is enrolled
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.class_id == class_id
    ).first()
    if not enrollment:
        raise HTTPException(status_code=403, detail="Not enrolled in this class")
    
    # Get today's check-ins
    today_start = datetime.now().replace(hour=0, minute=0, second=0)
    checkins = db.query(Checkin, User).join(User, Checkin.user_id == User.id).filter(
        Checkin.class_id == class_id,
        Checkin.checked_in_at >= today_start,
        User.visibility_level >= 2  # Only show class-visible users
    ).all()
    
    # Check if current user is checked in
    user_checkin = db.query(Checkin).filter(
        Checkin.user_id == current_user.id,
        Checkin.class_id == class_id,
        Checkin.checked_in_at >= today_start
    ).first()
    
    students = [
        StudentInClass(
            id=user.id,
            name=user.name,
            initials=get_initials(user.name),
            checked_in_at=checkin.checked_in_at.isoformat() if checkin.checked_in_at else None
        )
        for checkin, user in checkins
    ]
    
    headcount = len(checkins)
    
    return ClassDetailResponse(
        class_info=ClassResponse(
            id=cls.id,
            code=cls.code,
            name=cls.name,
            room=cls.room,
            start_time=cls.start_time,
            end_time=cls.end_time,
            building_id=cls.building_id,
            day_of_week=cls.day_of_week,
            total_students=cls.total_students,
            headcount=Headcount(checked_in=headcount, total=cls.total_students)
        ),
        students=students,
        is_checked_in=user_checkin is not None
    )


@router.get("/{class_id}/headcount")
def get_class_headcount(
    class_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get live headcount for a class."""
    cls = db.query(Class).filter(Class.id == class_id).first()
    if not cls:
        raise HTTPException(status_code=404, detail="Class not found")
    
    today_start = datetime.now().replace(hour=0, minute=0, second=0)
    headcount = db.query(Checkin).filter(
        Checkin.class_id == class_id,
        Checkin.checked_in_at >= today_start
    ).count()
    
    return {"checked_in": headcount, "total": cls.total_students}
