from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class QRCheckinRequest(BaseModel):
    qr_code: str


class CheckinResponse(BaseModel):
    success: bool
    message: str
    class_id: Optional[str] = None
    checked_in_at: Optional[datetime] = None


class CheckinStatus(BaseModel):
    checked_in: bool
    checked_in_at: Optional[datetime] = None
