from pydantic import BaseModel
from typing import Optional, List


class Headcount(BaseModel):
    checked_in: int
    total: int


class ClassBase(BaseModel):
    code: str
    name: str
    room: str
    start_time: str
    end_time: str


class ClassResponse(ClassBase):
    id: str
    building_id: Optional[str] = None
    day_of_week: Optional[int] = None
    total_students: int
    headcount: Optional[Headcount] = None
    
    class Config:
        from_attributes = True


class StudentInClass(BaseModel):
    id: str
    name: str
    initials: str
    checked_in_at: Optional[str] = None


class ClassDetailResponse(BaseModel):
    class_info: ClassResponse
    students: List[StudentInClass]
    is_checked_in: bool
