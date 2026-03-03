from sqlalchemy import Column, String, ForeignKey
from app.database import Base


class Enrollment(Base):
    __tablename__ = "enrollments"
    
    user_id = Column(String, ForeignKey("users.id"), primary_key=True)
    class_id = Column(String, ForeignKey("classes.id"), primary_key=True)
