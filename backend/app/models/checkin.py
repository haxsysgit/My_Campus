from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base
import uuid


class Checkin(Base):
    __tablename__ = "checkins"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    class_id = Column(String, ForeignKey("classes.id"), nullable=False)
    checked_in_at = Column(DateTime, server_default=func.now())
    method = Column(String, default="qr")  # 'qr', 'geo', 'manual'
