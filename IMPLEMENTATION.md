# 🚀 MyCampus Implementation Guide

> **App Name:** MyCampus  
> **Tagline:** *"Navigate. Connect. Stay Safe."*

---

## 💪 MAIN STRENGTH: The "Where's My Class?" Problem

### What Makes MyCampus Unique?

Every university app does **one thing**. MyCampus does **three things that naturally connect**:

```
┌─────────────────────────────────────────────────────────────────┐
│                    THE TRIPLE INTEGRATION                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   🗺️ NAVIGATION          👥 SOCIAL              🛡️ SAFETY       │
│   "Where is my class?"   "Who's going?"        "Am I safe?"     │
│         │                      │                     │          │
│         └──────────────────────┼─────────────────────┘          │
│                                │                                 │
│                                ▼                                 │
│                    ┌─────────────────────┐                      │
│                    │   ONE UNIFIED APP   │                      │
│                    │   with shared data  │                      │
│                    └─────────────────────┘                      │
│                                                                  │
│   Example Flow:                                                  │
│   1. "Navigate to CG76" → shows route                           │
│   2. "18 students already there" → social awareness             │
│   3. "Safe route available" → safety option                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Why This Wins the Hackathon

| Criteria | How CampusGuard Scores |
|----------|------------------------|
| **Innovation (15pts)** | Combines 3 briefs + ClassPulse social layer = unique |
| **Technical (25pts)** | Real-time location, QR scanning, pathfinding = impressive demo |
| **Feasibility (10pts)** | PWA = quick to build, no app stores |
| **Data Usage (10pts)** | Live attendance, building occupancy, friend locations |
| **Ethics (10pts)** | Opt-in privacy, GDPR, 3-level visibility |
| **UX (10pts)** | Clean mobile-first design, one-tap actions |

### The "Wow Factor" for Demo

> **Scenario:** *"It's 8:55am. You have a 9am lecture in CG76 but you're lost in Grove Building."*
>
> 1. Open CampusGuard → See you're in Grove
> 2. Tap "Next Class" → Shows CG76 with route (3 min walk)
> 3. See "12 students already there" → Classmates beat you!
> 4. Follow route → Arrive at room
> 5. Scan QR → Checked in at 9:01
> 6. Lecturer sees live headcount: 24/30
>
> **That's the demo. Simple. Impressive. Solves real problems.**

---

## 🏗️ ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (PWA)                           │
│                        Next.js 14 + React                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Pages: Map | Classes | Safety | Profile | Class Detail │    │
│  │  Components: MapView, ClassCard, EmergencyButton, etc.  │    │
│  │  State: Zustand (simple) or React Context               │    │
│  │  Styling: TailwindCSS                                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              │ REST API (JSON)                   │
│                              ▼                                   │
├─────────────────────────────────────────────────────────────────┤
│                         BACKEND (API)                            │
│                     FastAPI + Python 3.11                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Endpoints: /auth, /classes, /checkin, /location, etc.  │    │
│  │  Auth: JWT tokens (simple, no OAuth for hackathon)      │    │
│  │  Database: SQLite (dev) → PostgreSQL (prod)             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
├─────────────────────────────────────────────────────────────────┤
│                         DATABASE                                 │
│  Tables: users, classes, enrollments, checkins, locations,      │
│          friends, buildings                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 PROJECT STRUCTURE

```
hackathon3326/
├── frontend/                    # Next.js PWA
│   ├── app/                     # App Router (Next.js 14)
│   │   ├── page.tsx             # Home/Map screen
│   │   ├── classes/
│   │   │   ├── page.tsx         # ClassPulse list
│   │   │   └── [id]/page.tsx    # Class detail + check-in
│   │   ├── safety/page.tsx      # Safety center
│   │   ├── profile/page.tsx     # Profile + settings
│   │   └── layout.tsx           # Bottom nav layout
│   ├── components/
│   │   ├── ui/                  # Reusable UI components
│   │   ├── MapView.tsx          # Campus map component
│   │   ├── ClassCard.tsx        # Class list item
│   │   ├── QRScanner.tsx        # QR code scanner
│   │   ├── EmergencyButton.tsx  # Panic button
│   │   └── BottomNav.tsx        # Navigation bar
│   ├── lib/
│   │   ├── api.ts               # API client
│   │   └── auth.ts              # Auth helpers
│   ├── public/
│   │   ├── manifest.json        # PWA manifest
│   │   └── campus-map.png       # Map background
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                     # FastAPI
│   ├── app/
│   │   ├── main.py              # FastAPI app entry
│   │   ├── config.py            # Settings
│   │   ├── database.py          # DB connection
│   │   ├── models/              # SQLAlchemy models
│   │   │   ├── user.py
│   │   │   ├── class_.py
│   │   │   ├── checkin.py
│   │   │   └── location.py
│   │   ├── schemas/             # Pydantic schemas
│   │   │   ├── user.py
│   │   │   ├── class_.py
│   │   │   └── checkin.py
│   │   ├── routers/             # API routes
│   │   │   ├── auth.py
│   │   │   ├── classes.py
│   │   │   ├── checkin.py
│   │   │   ├── location.py
│   │   │   └── emergency.py
│   │   └── services/            # Business logic
│   │       ├── auth_service.py
│   │       └── location_service.py
│   ├── requirements.txt
│   └── seed_data.py             # Demo data seeder
│
├── HACKATHON_DECISION.md
├── IMPLEMENTATION.md            # This file
└── hackathon.pen                # Design file
```

---

# 🔧 BACKEND IMPLEMENTATION

## Tech Stack

| Component | Choice | Why |
|-----------|--------|-----|
| Framework | **FastAPI** | Fast, async, auto-docs, Python |
| Database | **SQLite** (dev) | Zero setup, file-based |
| ORM | **SQLAlchemy 2.0** | Industry standard, easy |
| Auth | **JWT + python-jose** | Simple token auth |
| Validation | **Pydantic v2** | Built into FastAPI |
| CORS | **fastapi-cors** | Allow frontend access |

## Database Schema

```sql
-- Users table
CREATE TABLE users (
    id TEXT PRIMARY KEY,           -- UUID
    email TEXT UNIQUE NOT NULL,    -- ak1234@live.mdx.ac.uk
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    visibility_level INTEGER DEFAULT 1,  -- 1=anon, 2=class, 3=friends
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Buildings table (from campus map)
CREATE TABLE buildings (
    id TEXT PRIMARY KEY,           -- 'college', 'grove', etc.
    name TEXT NOT NULL,            -- 'College Building'
    short_code TEXT NOT NULL,      -- 'C' for room codes
    lat REAL NOT NULL,
    lng REAL NOT NULL
);

-- Classes table
CREATE TABLE classes (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,            -- 'CST4080'
    name TEXT NOT NULL,            -- 'Software Engineering'
    room TEXT NOT NULL,            -- 'CG76'
    building_id TEXT REFERENCES buildings(id),
    day_of_week INTEGER,           -- 0=Mon, 6=Sun
    start_time TEXT,               -- '09:00'
    end_time TEXT,                 -- '11:00'
    total_students INTEGER DEFAULT 0
);

-- Enrollments (students in classes)
CREATE TABLE enrollments (
    user_id TEXT REFERENCES users(id),
    class_id TEXT REFERENCES classes(id),
    PRIMARY KEY (user_id, class_id)
);

-- Check-ins (attendance records)
CREATE TABLE checkins (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    class_id TEXT REFERENCES classes(id),
    checked_in_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    method TEXT DEFAULT 'qr'       -- 'qr', 'geo', 'manual'
);

-- User locations (for social features)
CREATE TABLE locations (
    user_id TEXT PRIMARY KEY REFERENCES users(id),
    building_id TEXT REFERENCES buildings(id),
    lat REAL,
    lng REAL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Friends table
CREATE TABLE friends (
    user_id TEXT REFERENCES users(id),
    friend_id TEXT REFERENCES users(id),
    status TEXT DEFAULT 'pending', -- 'pending', 'accepted'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, friend_id)
);
```

---

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/register` | Create account | `{email, name, password}` | `{user, token}` |
| POST | `/login` | Login | `{email, password}` | `{user, token}` |
| GET | `/me` | Get current user | - | `{user}` |

**Example - Login:**
```json
POST /api/auth/login
{
  "email": "ak1234@live.mdx.ac.uk",
  "password": "password123"
}

Response 200:
{
  "user": {
    "id": "uuid-here",
    "email": "ak1234@live.mdx.ac.uk",
    "name": "Alex Kumar",
    "visibility_level": 2
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Classes (`/api/classes`)

| Method | Endpoint | Description | Auth | Response |
|--------|----------|-------------|------|----------|
| GET | `/` | Get user's classes | Yes | `[{class}]` |
| GET | `/today` | Today's classes only | Yes | `[{class}]` |
| GET | `/{id}` | Single class detail | Yes | `{class, students, headcount}` |
| GET | `/{id}/headcount` | Live headcount | Yes | `{checked_in, total}` |

**Example - Get Today's Classes:**
```json
GET /api/classes/today
Authorization: Bearer <token>

Response 200:
{
  "classes": [
    {
      "id": "class-uuid",
      "code": "CST4080",
      "name": "Software Engineering",
      "room": "CG76",
      "building": "College Building",
      "start_time": "09:00",
      "end_time": "11:00",
      "headcount": {
        "checked_in": 18,
        "total": 24
      }
    }
  ]
}
```

### Check-in (`/api/checkin`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/qr` | Check in via QR | `{qr_code}` | `{success, checkin}` |
| GET | `/status/{class_id}` | Check if already checked in | - | `{checked_in, time}` |

**Example - QR Check-in:**
```json
POST /api/checkin/qr
Authorization: Bearer <token>
{
  "qr_code": "CAMPUS:CST4080:2024-03-03:secret123"
}

Response 200:
{
  "success": true,
  "checkin": {
    "class_id": "class-uuid",
    "checked_in_at": "2024-03-03T09:02:00Z",
    "method": "qr"
  },
  "message": "Checked in to Software Engineering!"
}
```

### Location (`/api/location`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/update` | Update my location | `{lat, lng, building_id}` | `{success}` |
| GET | `/friends` | Get friends' locations | - | `[{friend, location}]` |
| GET | `/classmates/{class_id}` | Classmates' locations | - | `[{user, location}]` |
| GET | `/buildings` | Building occupancy | - | `[{building, count}]` |

**Example - Get Friends' Locations:**
```json
GET /api/location/friends
Authorization: Bearer <token>

Response 200:
{
  "friends": [
    {
      "id": "friend-uuid",
      "name": "Sarah Johnson",
      "initials": "SJ",
      "location": {
        "building": "Sheppard Library",
        "updated_at": "2024-03-03T09:15:00Z",
        "distance_minutes": 2
      },
      "status": "stationary"
    }
  ]
}
```

### Emergency (`/api/emergency`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/alert` | Send panic alert | `{lat, lng, message?}` | `{alert_id}` |
| GET | `/contacts` | Get security contacts | - | `[{contact}]` |

---

## Backend Code Examples

### `backend/app/main.py`
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, classes, checkin, location, emergency
from app.database import create_tables

app = FastAPI(
    title="MyCampus API",
    description="Navigate. Connect. Stay Safe.",
    version="1.0.0"
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://mycampus.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(classes.router, prefix="/api/classes", tags=["Classes"])
app.include_router(checkin.router, prefix="/api/checkin", tags=["Check-in"])
app.include_router(location.router, prefix="/api/location", tags=["Location"])
app.include_router(emergency.router, prefix="/api/emergency", tags=["Emergency"])

@app.on_event("startup")
async def startup():
    create_tables()

@app.get("/")
def root():
    return {"message": "CampusGuard API", "docs": "/docs"}
```

### `backend/app/models/user.py`
```python
from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.sql import func
from app.database import Base
import uuid

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    visibility_level = Column(Integer, default=1)  # 1=anon, 2=class, 3=friends
    created_at = Column(DateTime, server_default=func.now())
```

### `backend/app/routers/classes.py`
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.models import Class, Enrollment, Checkin
from app.schemas.class_ import ClassResponse, ClassDetailResponse
from app.routers.auth import get_current_user

router = APIRouter()

@router.get("/today", response_model=List[ClassResponse])
def get_today_classes(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get all classes for today for the current user."""
    today = datetime.now().weekday()  # 0=Monday
    
    classes = db.query(Class).join(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Class.day_of_week == today
    ).order_by(Class.start_time).all()
    
    # Add headcount to each class
    result = []
    for cls in classes:
        headcount = db.query(Checkin).filter(
            Checkin.class_id == cls.id,
            Checkin.checked_in_at >= datetime.now().replace(hour=0, minute=0)
        ).count()
        
        result.append({
            **cls.__dict__,
            "headcount": {
                "checked_in": headcount,
                "total": cls.total_students
            }
        })
    
    return result

@router.get("/{class_id}", response_model=ClassDetailResponse)
def get_class_detail(
    class_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get detailed class info including checked-in students."""
    cls = db.query(Class).filter(Class.id == class_id).first()
    if not cls:
        raise HTTPException(status_code=404, detail="Class not found")
    
    # Get checked-in students (respecting visibility)
    checkins = db.query(Checkin, User).join(User).filter(
        Checkin.class_id == class_id,
        User.visibility_level >= 2  # Only show class-visible users
    ).all()
    
    return {
        "class": cls,
        "students": [{"name": u.name, "checked_in_at": c.checked_in_at} 
                     for c, u in checkins],
        "headcount": len(checkins)
    }
```

### `backend/app/routers/checkin.py`
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import hashlib

from app.database import get_db
from app.models import Checkin, Class
from app.schemas.checkin import QRCheckinRequest, CheckinResponse
from app.routers.auth import get_current_user

router = APIRouter()

def verify_qr_code(qr_code: str, class_id: str) -> bool:
    """Verify QR code is valid for this class and today."""
    # Format: CAMPUS:CLASS_CODE:DATE:SECRET
    # For hackathon demo, we'll use simple validation
    parts = qr_code.split(":")
    if len(parts) != 4 or parts[0] != "CAMPUS":
        return False
    
    # Check date is today
    today = datetime.now().strftime("%Y-%m-%d")
    return parts[2] == today

@router.post("/qr", response_model=CheckinResponse)
def qr_checkin(
    request: QRCheckinRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Check in to a class via QR code scan."""
    # Parse QR code to get class
    parts = request.qr_code.split(":")
    if len(parts) < 2:
        raise HTTPException(status_code=400, detail="Invalid QR code")
    
    class_code = parts[1]
    cls = db.query(Class).filter(Class.code == class_code).first()
    
    if not cls:
        raise HTTPException(status_code=404, detail="Class not found")
    
    if not verify_qr_code(request.qr_code, cls.id):
        raise HTTPException(status_code=400, detail="QR code expired or invalid")
    
    # Check not already checked in today
    existing = db.query(Checkin).filter(
        Checkin.user_id == current_user.id,
        Checkin.class_id == cls.id,
        Checkin.checked_in_at >= datetime.now().replace(hour=0, minute=0)
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already checked in")
    
    # Create check-in
    checkin = Checkin(
        user_id=current_user.id,
        class_id=cls.id,
        method="qr"
    )
    db.add(checkin)
    db.commit()
    
    return {
        "success": True,
        "checkin": checkin,
        "message": f"Checked in to {cls.name}!"
    }
```

---

## Demo Data Seeder

### `backend/seed_data.py`
```python
"""Seed database with demo data for hackathon."""
from app.database import SessionLocal, create_tables
from app.models import User, Building, Class, Enrollment
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed():
    create_tables()
    db = SessionLocal()
    
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
    for b in buildings:
        db.merge(Building(**b))
    
    # Demo users
    users = [
        {"id": "user1", "email": "ak1234@live.mdx.ac.uk", "name": "Alex Kumar", "visibility_level": 2},
        {"id": "user2", "email": "sj5678@live.mdx.ac.uk", "name": "Sarah Johnson", "visibility_level": 3},
        {"id": "user3", "email": "mp9012@live.mdx.ac.uk", "name": "Mike Patel", "visibility_level": 2},
        {"id": "user4", "email": "jd3456@live.mdx.ac.uk", "name": "Jane Doe", "visibility_level": 2},
    ]
    for u in users:
        db.merge(User(**u, password_hash=pwd_context.hash("demo123")))
    
    # Demo classes (Monday schedule)
    classes = [
        {"id": "c1", "code": "CST4080", "name": "Software Engineering", "room": "CG76", 
         "building_id": "college", "day_of_week": 0, "start_time": "09:00", "end_time": "11:00", "total_students": 24},
        {"id": "c2", "code": "CST3130", "name": "Data Structures", "room": "GF12",
         "building_id": "grove", "day_of_week": 0, "start_time": "11:30", "end_time": "13:30", "total_students": 30},
        {"id": "c3", "code": "CST2550", "name": "Web Development", "room": "H205",
         "building_id": "hatchcroft", "day_of_week": 0, "start_time": "14:00", "end_time": "16:00", "total_students": 28},
    ]
    for c in classes:
        db.merge(Class(**c))
    
    # Enroll all users in all classes
    for user in users:
        for cls in classes:
            db.merge(Enrollment(user_id=user["id"], class_id=cls["id"]))
    
    db.commit()
    print("✅ Database seeded with demo data!")

if __name__ == "__main__":
    seed()
```

---

## Backend Requirements

### `backend/requirements.txt`
```
fastapi==0.109.0
uvicorn[standard]==0.27.0
sqlalchemy==2.0.25
pydantic==2.5.3
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
```

### Run Backend
```bash
cd backend
pip install -r requirements.txt
python seed_data.py          # Seed demo data
uvicorn app.main:app --reload --port 8000
```

API docs available at: `http://localhost:8000/docs`

---

# 🎨 FRONTEND IMPLEMENTATION

## Tech Stack

| Component | Choice | Why |
|-----------|--------|-----|
| Framework | **Next.js 14** | App Router, Server Components, fast |
| Styling | **TailwindCSS** | Utility-first, matches our design |
| State | **Zustand** | Simple, minimal boilerplate |
| Maps | **Leaflet.js** | Free, open-source, works offline |
| QR Scanner | **html5-qrcode** | Works in browser, no native deps |
| Icons | **Lucide React** | Clean, consistent icons |
| PWA | **next-pwa** | Easy service worker setup |

---

## PWA Configuration

### `frontend/public/manifest.json`
```json
{
  "name": "MyCampus",
  "short_name": "MyCampus",
  "description": "Navigate. Connect. Stay Safe.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#3B82F6",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### `frontend/next.config.js`
```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})

module.exports = withPWA({
  // Next.js config
})
```

---

## Design System (from hackathon.pen)

### Colors (`frontend/tailwind.config.js`)
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'bg-primary': '#FFFFFF',
        'bg-card': '#F6F7F8',
        'text-primary': '#1A1A1A',
        'text-secondary': '#6B7280',
        'text-tertiary': '#9CA3AF',
        'accent-blue': '#3B82F6',
        'accent-coral': '#FF6B6B',
        'accent-green': '#22C55E',
        'danger-red': '#EF4444',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
    },
  },
}
```

---

## Page Structure

### App Layout (`frontend/app/layout.tsx`)
```tsx
import { BottomNav } from '@/components/BottomNav'
import './globals.css'

export const metadata = {
  title: 'MyCampus',
  description: 'Navigate. Connect. Stay Safe.',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#3B82F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="font-sans bg-bg-primary min-h-screen pb-20">
        <main className="max-w-md mx-auto">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  )
}
```

---

## Core Components

### Bottom Navigation (`frontend/components/BottomNav.tsx`)
```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Map, Users, Shield, User } from 'lucide-react'

const navItems = [
  { href: '/', icon: Map, label: 'Map' },
  { href: '/classes', icon: Users, label: 'Classes' },
  { href: '/safety', icon: Shield, label: 'Safety' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export function BottomNav() {
  const pathname = usePathname()
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 pt-3 pb-8">
      <div className="max-w-md mx-auto flex justify-around">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 ${
                isActive ? 'text-accent-blue' : 'text-text-tertiary'
              }`}
            >
              <Icon size={22} />
              <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
```

### Class Card (`frontend/components/ClassCard.tsx`)
```tsx
import Link from 'next/link'
import { Clock, MapPin, Users } from 'lucide-react'

interface ClassCardProps {
  id: string
  code: string
  name: string
  room: string
  startTime: string
  endTime: string
  checkedIn: number
  total: number
  isCheckedIn?: boolean
}

export function ClassCard({
  id, code, name, room, startTime, endTime, checkedIn, total, isCheckedIn
}: ClassCardProps) {
  const percentage = Math.round((checkedIn / total) * 100)
  
  return (
    <Link href={`/classes/${id}`}>
      <div className="bg-bg-card rounded-2xl p-4 space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-semibold text-accent-blue">{code}</span>
            <h3 className="font-bold text-text-primary">{name}</h3>
          </div>
          {isCheckedIn && (
            <span className="bg-accent-green/10 text-accent-green text-xs font-semibold px-2 py-1 rounded-full">
              ✓ Checked In
            </span>
          )}
        </div>
        
        {/* Info row */}
        <div className="flex gap-4 text-sm text-text-secondary">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{startTime} - {endTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            <span>{room}</span>
          </div>
        </div>
        
        {/* Attendance bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-text-secondary flex items-center gap-1">
              <Users size={12} /> Attendance
            </span>
            <span className="font-semibold text-accent-blue">{checkedIn}/{total}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent-green rounded-full transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
```

### Emergency Button (`frontend/components/EmergencyButton.tsx`)
```tsx
'use client'
import { useState, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'

export function EmergencyButton() {
  const [isHolding, setIsHolding] = useState(false)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<NodeJS.Timeout>()
  const intervalRef = useRef<NodeJS.Timeout>()
  
  const HOLD_DURATION = 2000 // 2 seconds to activate
  
  const handleStart = () => {
    setIsHolding(true)
    setProgress(0)
    
    // Progress animation
    let p = 0
    intervalRef.current = setInterval(() => {
      p += 5
      setProgress(p)
    }, HOLD_DURATION / 20)
    
    // Trigger after hold duration
    timerRef.current = setTimeout(() => {
      triggerEmergency()
    }, HOLD_DURATION)
  }
  
  const handleEnd = () => {
    setIsHolding(false)
    setProgress(0)
    if (timerRef.current) clearTimeout(timerRef.current)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }
  
  const triggerEmergency = async () => {
    // Get location and send alert
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        await fetch('/api/emergency/alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        })
        alert('🚨 Emergency alert sent! Security has been notified.')
      })
    }
    handleEnd()
  }
  
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
        className={`
          relative w-48 h-48 rounded-full 
          bg-danger-red text-white
          flex flex-col items-center justify-center gap-2
          shadow-lg shadow-danger-red/50
          transition-transform
          ${isHolding ? 'scale-95' : 'scale-100'}
        `}
      >
        {/* Progress ring */}
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="46"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="4"
          />
          <circle
            cx="50" cy="50" r="46"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeDasharray={`${progress * 2.89} 289`}
            className="transition-all"
          />
        </svg>
        
        <AlertTriangle size={48} />
        <span className="text-lg font-extrabold">EMERGENCY</span>
        <span className="text-xs opacity-70">Hold to alert</span>
      </button>
      <p className="text-sm text-text-secondary text-center">
        Alerts security with your location
      </p>
    </div>
  )
}
```

### QR Scanner (`frontend/components/QRScanner.tsx`)
```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

interface QRScannerProps {
  onScan: (code: string) => void
  onClose: () => void
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [error, setError] = useState<string>()
  const scannerRef = useRef<Html5Qrcode>()
  
  useEffect(() => {
    const scanner = new Html5Qrcode('qr-reader')
    scannerRef.current = scanner
    
    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        scanner.stop()
        onScan(decodedText)
      },
      () => {} // Ignore errors during scanning
    ).catch(err => {
      setError('Camera access denied. Please allow camera permissions.')
    })
    
    return () => {
      scanner.stop().catch(() => {})
    }
  }, [onScan])
  
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-white font-bold text-lg">Scan QR Code</h2>
        <button onClick={onClose} className="text-white text-2xl">&times;</button>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div id="qr-reader" className="w-full max-w-sm rounded-2xl overflow-hidden" />
      </div>
      
      {error && (
        <div className="p-4 bg-danger-red text-white text-center">
          {error}
        </div>
      )}
      
      <p className="text-white/70 text-center p-4">
        Point camera at the QR code displayed by your lecturer
      </p>
    </div>
  )
}
```

---

## Page Implementations

### Home/Map Page (`frontend/app/page.tsx`)
```tsx
'use client'
import { useState } from 'react'
import { Search, Bell, Navigation, MapPin } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamic import to avoid SSR issues with Leaflet
const CampusMap = dynamic(() => import('@/components/CampusMap'), { ssr: false })

export default function HomePage() {
  const [routeMode, setRouteMode] = useState<'fastest' | 'safest'>('fastest')
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Status Bar placeholder */}
      <div className="h-12" />
      
      {/* Header */}
      <header className="px-5 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent-blue rounded-lg" />
          <span className="font-bold text-lg">MyCampus</span>
        </div>
        <button className="w-10 h-10 bg-bg-card rounded-full flex items-center justify-center">
          <Bell size={20} className="text-text-secondary" />
        </button>
      </header>
      
      {/* Map */}
      <div className="flex-1 relative bg-green-100">
        <CampusMap />
      </div>
      
      {/* Search & Controls */}
      <div className="p-5 space-y-4 bg-white">
        {/* Search Bar */}
        <div className="flex items-center gap-3 bg-bg-card rounded-full px-4 py-3">
          <Search size={20} className="text-text-tertiary" />
          <input
            type="text"
            placeholder="Search buildings, rooms..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
        
        {/* Route Toggle */}
        <div className="flex bg-bg-card rounded-full p-1">
          <button
            onClick={() => setRouteMode('fastest')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
              routeMode === 'fastest' 
                ? 'bg-accent-blue text-white' 
                : 'text-text-secondary'
            }`}
          >
            <Navigation size={14} className="inline mr-1" /> Fastest
          </button>
          <button
            onClick={() => setRouteMode('safest')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
              routeMode === 'safest' 
                ? 'bg-accent-blue text-white' 
                : 'text-text-secondary'
            }`}
          >
            <MapPin size={14} className="inline mr-1" /> Safest
          </button>
        </div>
        
        {/* Quick Actions */}
        <div>
          <h3 className="font-bold text-text-primary mb-3">Quick Actions</h3>
          <div className="flex gap-3">
            <QuickAction icon="📚" label="Next Class" color="bg-blue-50" />
            <QuickAction icon="👥" label="ClassPulse" color="bg-green-50" />
            <QuickAction icon="🚨" label="Emergency" color="bg-red-50" textColor="text-danger-red" />
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickAction({ icon, label, color, textColor = 'text-text-primary' }: {
  icon: string; label: string; color: string; textColor?: string
}) {
  return (
    <button className={`${color} rounded-2xl p-4 flex-1 flex flex-col items-center gap-2`}>
      <span className="text-2xl">{icon}</span>
      <span className={`text-xs font-medium ${textColor}`}>{label}</span>
    </button>
  )
}
```

### Classes Page (`frontend/app/classes/page.tsx`)
```tsx
import { ClassCard } from '@/components/ClassCard'
import { QrCode } from 'lucide-react'
import Link from 'next/link'

// In real app, fetch from API
async function getTodaysClasses() {
  return [
    {
      id: 'c1',
      code: 'CST4080',
      name: 'Software Engineering',
      room: 'CG76',
      startTime: '09:00',
      endTime: '11:00',
      checkedIn: 18,
      total: 24,
      isCheckedIn: true,
    },
    {
      id: 'c2',
      code: 'CST3130',
      name: 'Data Structures',
      room: 'GF12',
      startTime: '11:30',
      endTime: '13:30',
      checkedIn: 12,
      total: 30,
      isCheckedIn: false,
    },
    {
      id: 'c3',
      code: 'CST2550',
      name: 'Web Development',
      room: 'H205',
      startTime: '14:00',
      endTime: '16:00',
      checkedIn: 0,
      total: 28,
      isCheckedIn: false,
    },
  ]
}

export default async function ClassesPage() {
  const classes = await getTodaysClasses()
  
  // Calculate stats
  const totalClasses = classes.length
  const attendedClasses = classes.filter(c => c.isCheckedIn).length
  const attendanceRate = Math.round((attendedClasses / totalClasses) * 100)
  
  return (
    <div className="min-h-screen">
      {/* Status Bar placeholder */}
      <div className="h-12" />
      
      {/* Header */}
      <header className="px-5 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold">ClassPulse</h1>
        <Link 
          href="/scan"
          className="w-10 h-10 bg-accent-blue rounded-xl flex items-center justify-center"
        >
          <QrCode size={20} className="text-white" />
        </Link>
      </header>
      
      {/* Today's Classes */}
      <section className="px-5 py-4">
        <h2 className="font-bold text-lg mb-3">Today's Classes</h2>
        <div className="space-y-3">
          {classes.map(cls => (
            <ClassCard key={cls.id} {...cls} />
          ))}
        </div>
      </section>
      
      {/* Attendance Stats */}
      <section className="px-5 py-4">
        <h2 className="font-bold text-lg mb-3">Your Attendance</h2>
        <div className="flex gap-3">
          <StatCard 
            label="This Week" 
            value="94%" 
            color="text-accent-green" 
            bgColor="bg-green-50"
          />
          <StatCard 
            label="This Month" 
            value="87%" 
            color="text-accent-blue" 
            bgColor="bg-blue-50"
          />
        </div>
      </section>
    </div>
  )
}

function StatCard({ label, value, color, bgColor }: {
  label: string; value: string; color: string; bgColor: string
}) {
  return (
    <div className={`${bgColor} rounded-2xl p-4 flex-1`}>
      <p className="text-xs text-text-secondary mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  )
}
```

### Class Detail Page (`frontend/app/classes/[id]/page.tsx`)
```tsx
'use client'
import { useState } from 'react'
import { ArrowLeft, Clock, MapPin, Camera, Check } from 'lucide-react'
import Link from 'next/link'
import { QRScanner } from '@/components/QRScanner'

export default function ClassDetailPage({ params }: { params: { id: string } }) {
  const [showScanner, setShowScanner] = useState(false)
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  
  // Mock data - fetch from API in real app
  const classData = {
    code: 'CST4080',
    name: 'Software Engineering',
    room: 'CG76',
    startTime: '09:00',
    endTime: '11:00',
    checkedIn: 18,
    total: 24,
    students: [
      { name: 'Alex Kumar', initials: 'AK', color: 'bg-blue-100 text-accent-blue' },
      { name: 'Sarah Johnson', initials: 'SJ', color: 'bg-green-100 text-accent-green' },
      { name: 'Mike Patel', initials: 'MP', color: 'bg-yellow-100 text-yellow-600' },
      { name: 'Jane Doe', initials: 'JD', color: 'bg-purple-100 text-purple-600' },
    ]
  }
  
  const handleScan = async (code: string) => {
    setShowScanner(false)
    // Call API to check in
    try {
      const res = await fetch('/api/checkin/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qr_code: code }),
      })
      if (res.ok) {
        setIsCheckedIn(true)
      }
    } catch (err) {
      console.error('Check-in failed:', err)
    }
  }
  
  return (
    <div className="min-h-screen">
      {showScanner && (
        <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />
      )}
      
      {/* Status Bar placeholder */}
      <div className="h-12" />
      
      {/* Header */}
      <header className="px-5 py-3 flex items-center gap-3">
        <Link href="/classes" className="w-10 h-10 bg-bg-card rounded-xl flex items-center justify-center">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold">Class Details</h1>
      </header>
      
      {/* Class Info Card */}
      <div className="mx-5 bg-blue-50 rounded-2xl p-5 space-y-3">
        <h2 className="text-xl font-bold">{classData.name}</h2>
        <div className="flex gap-4 text-sm text-text-secondary">
          <span className="flex items-center gap-1">
            <Clock size={14} /> {classData.startTime} - {classData.endTime}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={14} /> Room {classData.room}
          </span>
        </div>
        
        {/* Attendance Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Attendance</span>
            <span className="font-semibold text-accent-blue">
              {classData.checkedIn}/{classData.total} students
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent-green rounded-full"
              style={{ width: `${(classData.checkedIn / classData.total) * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Check-in Section */}
      <div className="p-5 flex flex-col items-center gap-4">
        <div className="w-36 h-36 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center">
          <span className="text-5xl">📱</span>
        </div>
        
        <button
          onClick={() => setShowScanner(true)}
          disabled={isCheckedIn}
          className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 ${
            isCheckedIn 
              ? 'bg-accent-green text-white' 
              : 'bg-accent-blue text-white'
          }`}
        >
          {isCheckedIn ? (
            <>
              <Check size={20} /> Checked In!
            </>
          ) : (
            <>
              <Camera size={20} /> Scan to Check In
            </>
          )}
        </button>
      </div>
      
      {/* Students List */}
      <div className="px-5 py-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold">Checked In Students</h3>
          <span className="font-bold text-accent-green">{classData.checkedIn}</span>
        </div>
        <div className="space-y-2">
          {classData.students.map((student, i) => (
            <div key={i} className="flex items-center gap-3 bg-bg-card rounded-xl p-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${student.color}`}>
                {student.initials}
              </div>
              <span className="flex-1 font-medium">{student.name}</span>
              <Check size={16} className="text-accent-green" />
            </div>
          ))}
          <div className="border border-dashed border-gray-300 rounded-xl p-3 text-center text-text-secondary">
            +{classData.checkedIn - classData.students.length} more students
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## API Client (`frontend/lib/api.ts`)
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class ApiClient {
  private token: string | null = null
  
  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
    }
  }
  
  getToken() {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('token')
    }
    return this.token
  }
  
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken()
    
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    })
    
    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`)
    }
    
    return res.json()
  }
  
  // Auth
  async login(email: string, password: string) {
    const data = await this.request<{ user: any; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    this.setToken(data.token)
    return data
  }
  
  // Classes
  async getTodaysClasses() {
    return this.request<{ classes: any[] }>('/api/classes/today')
  }
  
  async getClassDetail(id: string) {
    return this.request<any>(`/api/classes/${id}`)
  }
  
  // Check-in
  async checkInWithQR(qrCode: string) {
    return this.request<any>('/api/checkin/qr', {
      method: 'POST',
      body: JSON.stringify({ qr_code: qrCode }),
    })
  }
  
  // Location
  async updateLocation(lat: number, lng: number, buildingId?: string) {
    return this.request<any>('/api/location/update', {
      method: 'POST',
      body: JSON.stringify({ lat, lng, building_id: buildingId }),
    })
  }
  
  async getFriendsLocations() {
    return this.request<{ friends: any[] }>('/api/location/friends')
  }
  
  // Emergency
  async sendEmergencyAlert(lat: number, lng: number, message?: string) {
    return this.request<any>('/api/emergency/alert', {
      method: 'POST',
      body: JSON.stringify({ lat, lng, message }),
    })
  }
}

export const api = new ApiClient()
```

---

## Frontend Requirements

### `frontend/package.json`
```json
{
  "name": "mycampus-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.1.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "html5-qrcode": "^2.3.8",
    "lucide-react": "^0.312.0",
    "zustand": "^4.5.0",
    "next-pwa": "^5.6.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.0.0",
    "@types/leaflet": "^1.9.8",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### Run Frontend
```bash
cd frontend
npm install
npm run dev
```

App available at: `http://localhost:3000`

---

## Deployment

### Backend → Railway
```bash
# railway.toml
[build]
  builder = "NIXPACKS"

[deploy]
  startCommand = "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
```

### Frontend → Vercel
```bash
# Auto-detected as Next.js
# Set environment variable:
# NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app
```

---

## Quick Start for Hackathon

```bash
# Terminal 1: Backend
cd backend
pip install -r requirements.txt
python seed_data.py
uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend
npm install
npm run dev

# Open: http://localhost:3000
# API Docs: http://localhost:8000/docs
```

---

## Demo Credentials

| Email | Password | User |
|-------|----------|------|
| `ak1234@live.mdx.ac.uk` | `demo123` | Alex Kumar |
| `sj5678@live.mdx.ac.uk` | `demo123` | Sarah Johnson |
| `mp9012@live.mdx.ac.uk` | `demo123` | Mike Patel |

---

## Feature Checklist for MVP

### Must Have ✅
- [ ] Campus map with buildings
- [ ] Today's classes list
- [ ] QR code check-in
- [ ] Live headcount
- [ ] Emergency button

### Nice to Have 🎯
- [ ] Friend locations on map
- [ ] Route planning (fastest/safest toggle)
- [ ] Push notifications
- [ ] Offline support (PWA)

### Extensions 🚀
- [ ] Lecturer dashboard
- [ ] Attendance export
- [ ] Building occupancy heatmap
