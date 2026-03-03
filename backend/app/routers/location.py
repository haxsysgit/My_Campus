from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List

from app.database import get_db
from app.models import User, Location, Friend, Building
from app.schemas.location import (
    LocationUpdate, FriendLocation, FriendsLocationResponse, BuildingOccupancy
)
from app.routers.auth import get_current_user

router = APIRouter()


def get_initials(name: str) -> str:
    """Get initials from a name."""
    parts = name.split()
    if len(parts) >= 2:
        return f"{parts[0][0]}{parts[-1][0]}".upper()
    return name[:2].upper() if name else "??"


@router.post("/update")
def update_location(
    location: LocationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update current user's location."""
    existing = db.query(Location).filter(Location.user_id == current_user.id).first()
    
    if existing:
        existing.lat = location.lat
        existing.lng = location.lng
        existing.building_id = location.building_id
    else:
        new_location = Location(
            user_id=current_user.id,
            lat=location.lat,
            lng=location.lng,
            building_id=location.building_id
        )
        db.add(new_location)
    
    db.commit()
    return {"success": True, "message": "Location updated"}


@router.get("/friends", response_model=FriendsLocationResponse)
def get_friends_locations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get locations of all friends who are sharing."""
    # Get accepted friends (bidirectional)
    friend_ids = db.query(Friend.friend_id).filter(
        Friend.user_id == current_user.id,
        Friend.status == "accepted"
    ).union(
        db.query(Friend.user_id).filter(
            Friend.friend_id == current_user.id,
            Friend.status == "accepted"
        )
    ).all()
    
    friend_ids = [f[0] for f in friend_ids]
    
    # Get friends with visibility level 3 (friends visible)
    friends_with_locations = db.query(User, Location, Building).outerjoin(
        Location, User.id == Location.user_id
    ).outerjoin(
        Building, Location.building_id == Building.id
    ).filter(
        User.id.in_(friend_ids),
        User.visibility_level >= 3
    ).all()
    
    result = []
    for user, location, building in friends_with_locations:
        result.append(FriendLocation(
            id=user.id,
            name=user.name,
            initials=get_initials(user.name),
            building=building.name if building else None,
            lat=location.lat if location else None,
            lng=location.lng if location else None,
            updated_at=location.updated_at if location else None,
            status="stationary"
        ))
    
    return FriendsLocationResponse(friends=result)


@router.get("/buildings", response_model=List[BuildingOccupancy])
def get_building_occupancy(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get occupancy count for each building."""
    buildings = db.query(Building).all()
    
    result = []
    for building in buildings:
        count = db.query(Location).filter(
            Location.building_id == building.id
        ).count()
        result.append(BuildingOccupancy(
            id=building.id,
            name=building.name,
            count=count
        ))
    
    return result
