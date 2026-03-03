from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class LocationUpdate(BaseModel):
    lat: float
    lng: float
    building_id: Optional[str] = None


class FriendLocation(BaseModel):
    id: str
    name: str
    initials: str
    building: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    updated_at: Optional[datetime] = None
    status: str = "stationary"  # 'stationary', 'walking'


class FriendsLocationResponse(BaseModel):
    friends: List[FriendLocation]


class BuildingOccupancy(BaseModel):
    id: str
    name: str
    count: int


class EmergencyAlert(BaseModel):
    lat: float
    lng: float
    message: Optional[str] = None


class EmergencyResponse(BaseModel):
    success: bool
    alert_id: str
    message: str
