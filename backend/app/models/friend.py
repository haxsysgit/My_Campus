from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class Friend(Base):
    __tablename__ = "friends"
    
    user_id = Column(String, ForeignKey("users.id"), primary_key=True)
    friend_id = Column(String, ForeignKey("users.id"), primary_key=True)
    status = Column(String, default="pending")  # 'pending', 'accepted'
    created_at = Column(DateTime, server_default=func.now())
