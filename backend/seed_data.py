"""
Seed database with demo data for hackathon.
Run: python seed_data.py
"""
import sys
sys.path.insert(0, '.')

from passlib.context import CryptContext
from app.database import SessionLocal, create_tables
from app.models import User, Building, Class, Enrollment, Friend, Location

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def seed():
    create_tables()
    db = SessionLocal()
    
    print("🌱 Seeding database...")
    
    # Buildings (from Middlesex campus map)
    buildings = [
        {"id": "college", "name": "College Building", "short_code": "C", "lat": 51.5899, "lng": -0.2284},
        {"id": "grove", "name": "Grove Building", "short_code": "G", "lat": 51.5905, "lng": -0.2290},
        {"id": "library", "name": "Sheppard Library", "short_code": "L", "lat": 51.5895, "lng": -0.2280},
        {"id": "hatchcroft", "name": "Hatchcroft", "short_code": "H", "lat": 51.5892, "lng": -0.2295},
        {"id": "mdx_house", "name": "MDX House", "short_code": "M", "lat": 51.5902, "lng": -0.2275},
        {"id": "ritterman", "name": "Ritterman Building", "short_code": "R", "lat": 51.5908, "lng": -0.2270},
        {"id": "williams", "name": "Williams Building", "short_code": "W", "lat": 51.5890, "lng": -0.2265},
    ]
    print(f"  📍 Adding {len(buildings)} buildings...")
    for b in buildings:
        existing = db.query(Building).filter(Building.id == b["id"]).first()
        if not existing:
            db.add(Building(**b))
    
    # Demo users
    users = [
        {"id": "user1", "email": "ak1234@live.mdx.ac.uk", "name": "Alex Kumar", "visibility_level": 2},
        {"id": "user2", "email": "sj5678@live.mdx.ac.uk", "name": "Sarah Johnson", "visibility_level": 3},
        {"id": "user3", "email": "mp9012@live.mdx.ac.uk", "name": "Mike Patel", "visibility_level": 2},
        {"id": "user4", "email": "jd3456@live.mdx.ac.uk", "name": "Jane Doe", "visibility_level": 3},
        {"id": "user5", "email": "rk7890@live.mdx.ac.uk", "name": "Raj Kapoor", "visibility_level": 1},
    ]
    print(f"  👤 Adding {len(users)} demo users...")
    for u in users:
        existing = db.query(User).filter(User.id == u["id"]).first()
        if not existing:
            db.add(User(**u, password_hash=pwd_context.hash("demo123")))
    
    # Demo classes (Monday schedule - weekday 0)
    classes = [
        {
            "id": "c1", "code": "CST4080", "name": "Software Engineering", 
            "room": "CG76", "building_id": "college", 
            "day_of_week": 0, "start_time": "09:00", "end_time": "11:00", 
            "total_students": 24
        },
        {
            "id": "c2", "code": "CST3130", "name": "Data Structures", 
            "room": "GF12", "building_id": "grove", 
            "day_of_week": 0, "start_time": "11:30", "end_time": "13:30", 
            "total_students": 30
        },
        {
            "id": "c3", "code": "CST2550", "name": "Web Development", 
            "room": "H205", "building_id": "hatchcroft", 
            "day_of_week": 0, "start_time": "14:00", "end_time": "16:00", 
            "total_students": 28
        },
        {
            "id": "c4", "code": "CST1500", "name": "Intro to Programming", 
            "room": "RG01", "building_id": "ritterman", 
            "day_of_week": 1, "start_time": "10:00", "end_time": "12:00", 
            "total_students": 40
        },
        {
            "id": "c5", "code": "CST3990", "name": "Final Year Project", 
            "room": "LB10", "building_id": "library", 
            "day_of_week": 2, "start_time": "13:00", "end_time": "15:00", 
            "total_students": 15
        },
    ]
    print(f"  📚 Adding {len(classes)} classes...")
    for c in classes:
        existing = db.query(Class).filter(Class.id == c["id"]).first()
        if not existing:
            db.add(Class(**c))
    
    db.commit()
    
    # Enrollments - enroll users in classes
    enrollments = [
        # User 1 (Alex) - enrolled in first 3 classes
        ("user1", "c1"), ("user1", "c2"), ("user1", "c3"),
        # User 2 (Sarah) - enrolled in all classes
        ("user2", "c1"), ("user2", "c2"), ("user2", "c3"), ("user2", "c4"), ("user2", "c5"),
        # User 3 (Mike) - enrolled in first 2 classes
        ("user3", "c1"), ("user3", "c2"),
        # User 4 (Jane) - enrolled in last 3 classes
        ("user4", "c3"), ("user4", "c4"), ("user4", "c5"),
        # User 5 (Raj) - enrolled in first class only
        ("user5", "c1"),
    ]
    print(f"  📝 Adding {len(enrollments)} enrollments...")
    for user_id, class_id in enrollments:
        existing = db.query(Enrollment).filter(
            Enrollment.user_id == user_id,
            Enrollment.class_id == class_id
        ).first()
        if not existing:
            db.add(Enrollment(user_id=user_id, class_id=class_id))
    
    # Friendships
    friendships = [
        ("user1", "user2", "accepted"),  # Alex <-> Sarah are friends
        ("user1", "user3", "accepted"),  # Alex <-> Mike are friends
        ("user2", "user4", "accepted"),  # Sarah <-> Jane are friends
        ("user3", "user4", "pending"),   # Mike sent request to Jane
    ]
    print(f"  👥 Adding {len(friendships)} friendships...")
    for user_id, friend_id, status in friendships:
        existing = db.query(Friend).filter(
            Friend.user_id == user_id,
            Friend.friend_id == friend_id
        ).first()
        if not existing:
            db.add(Friend(user_id=user_id, friend_id=friend_id, status=status))
    
    # Sample locations for friends
    locations = [
        ("user2", "library", 51.5895, -0.2280),   # Sarah at Library
        ("user3", "grove", 51.5905, -0.2290),     # Mike at Grove
        ("user4", "college", 51.5899, -0.2284),   # Jane at College
    ]
    print(f"  📍 Adding {len(locations)} locations...")
    for user_id, building_id, lat, lng in locations:
        existing = db.query(Location).filter(Location.user_id == user_id).first()
        if not existing:
            db.add(Location(user_id=user_id, building_id=building_id, lat=lat, lng=lng))
    
    db.commit()
    db.close()
    
    print("✅ Database seeded successfully!")
    print("\n📧 Demo credentials:")
    print("   Email: ak1234@live.mdx.ac.uk")
    print("   Password: demo123")
    print("\n🚀 Run: uvicorn app.main:app --reload")


if __name__ == "__main__":
    seed()
