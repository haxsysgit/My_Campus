from sqlalchemy import Column, String, Integer, ForeignKey
from app.database import Base


class Class(Base):
    __tablename__ = "classes"
    
    id = Column(String, primary_key=True)
    code = Column(String, nullable=False)  # 'CST4080'
    name = Column(String, nullable=False)  # 'Software Engineering'
    room = Column(String, nullable=False)  # 'CG76'
    building_id = Column(String, ForeignKey("buildings.id"))
    day_of_week = Column(Integer)  # 0=Mon, 6=Sun
    start_time = Column(String)  # '09:00'
    end_time = Column(String)  # '11:00'
    total_students = Column(Integer, default=0)
