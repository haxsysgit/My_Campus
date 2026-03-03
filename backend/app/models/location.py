from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class Location(Base):
    __tablename__ = "locations"
    
    user_id = Column(String, ForeignKey("users.id"), primary_key=True)
    building_id = Column(String, ForeignKey("buildings.id"), nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
