from sqlalchemy import Column, String, Float
from app.database import Base


class Building(Base):
    __tablename__ = "buildings"
    
    id = Column(String, primary_key=True)  # 'college', 'grove', etc.
    name = Column(String, nullable=False)  # 'College Building'
    short_code = Column(String, nullable=False)  # 'C' for room codes
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
