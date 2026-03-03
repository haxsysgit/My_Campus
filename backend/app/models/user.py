from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.sql import func
from app.database import Base
import uuid


class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False, index=True)
    student_id = Column(String, unique=True, nullable=True)  # e.g., M01081164
    name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    visibility_level = Column(Integer, default=1)  # 1=anon, 2=class, 3=friends
    created_at = Column(DateTime, server_default=func.now())
