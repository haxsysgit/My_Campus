# 🔧 MyCampus Backend Implementation

> FastAPI + SQLAlchemy + SQLite

---

## 📦 Git Commit Strategy

Commit after each completed slice to maintain a clean history.

| After | Commit Message |
|-------|----------------|
| Initial | `feat: scaffold backend with FastAPI structure` |
| Slice 1 | `feat: add auth endpoints with JWT` |
| Slice 2 | `feat: add classes endpoints` |
| Slice 3 | `feat: add QR check-in endpoint` |
| Slice 4 | `feat: add class detail endpoint` |
| Slice 5 | `feat: add emergency endpoints` |
| Slice 6 | `feat: add location and friends endpoints` |

```bash
git add .
git commit -m "feat: <slice description>"
git push origin main
```

---

## 🏗️ Build Order: Vertical Slices

We build **feature-by-feature** (end-to-end), not layer-by-layer. Each slice delivers real value.

| Slice | Feature | Status |
|-------|---------|--------|
| 1 | **Auth** - Login/Register + JWT | ✅ Done |
| 2 | **Classes** - Get today's classes | ✅ Done |
| 3 | **Check-in** - QR code scan | ✅ Done |
| 4 | **Class Detail** - Attendance info | ✅ Done |
| 5 | **Emergency** - Panic alert | ✅ Done |
| 6 | **Location** - Friends locations | ✅ Done |

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI entry point
│   ├── config.py            # Settings (JWT secret, DB URL)
│   ├── database.py          # SQLAlchemy setup
│   ├── models/              # Database models
│   │   ├── user.py          # User model
│   │   ├── building.py      # Campus buildings
│   │   ├── class_.py        # Class/course model
│   │   ├── enrollment.py    # User-class relationship
│   │   ├── checkin.py       # Attendance records
│   │   ├── location.py      # User locations
│   │   └── friend.py        # Friend relationships
│   ├── schemas/             # Pydantic request/response
│   │   ├── user.py
│   │   ├── class_.py
│   │   ├── checkin.py
│   │   └── location.py
│   └── routers/             # API endpoints
│       ├── auth.py          # /api/auth/*
│       ├── classes.py       # /api/classes/*
│       ├── checkin.py       # /api/checkin/*
│       ├── location.py      # /api/location/*
│       └── emergency.py     # /api/emergency/*
├── seed_data.py             # Demo data loader
├── requirements.txt
└── mycampus.db              # SQLite database
```

---

## 🚀 Quick Start

```bash
cd backend
uv venv
source .venv/bin/activate
uv pip install -r requirements.txt
python seed_data.py
uvicorn app.main:app --reload
```

- **API:** http://localhost:8000
- **Docs:** http://localhost:8000/docs

---

## 🔐 Slice 1: Authentication

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new user |
| POST | `/api/auth/login` | Get JWT token |
| GET | `/api/auth/me` | Get current user |

### Test with cURL

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "ak1234@live.mdx.ac.uk", "password": "demo123"}'

# Response: {"user": {...}, "token": "eyJ..."}
```

### Frontend needs
- Login form → POST `/api/auth/login`
- Store token in localStorage
- Send `Authorization: Bearer <token>` header

---

## 📚 Slice 2: Classes List

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/classes/` | All user's classes |
| GET | `/api/classes/today` | Today's classes only |

### Test

```bash
curl http://localhost:8000/api/classes/today \
  -H "Authorization: Bearer <token>"
```

### Response

```json
[
  {
    "id": "c1",
    "code": "CST4080",
    "name": "Software Engineering",
    "room": "CG76",
    "start_time": "09:00",
    "end_time": "11:00",
    "headcount": {"checked_in": 18, "total": 24}
  }
]
```

---

## ✅ Slice 3: QR Check-in

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/checkin/qr` | Check in via QR scan |
| GET | `/api/checkin/status/{class_id}` | Check if already in |

### QR Code Format

```
CAMPUS:CLASS_CODE:DATE:SECRET
CAMPUS:CST4080:2024-03-03:abc123
CAMPUS:CST4080:DEMO:test        # Demo mode (any date)
```

### Test

```bash
curl -X POST http://localhost:8000/api/checkin/qr \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"qr_code": "CAMPUS:CST4080:DEMO:test"}'
```

---

## 📊 Slice 4: Class Detail

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/classes/{id}` | Class + students list |
| GET | `/api/classes/{id}/headcount` | Live headcount |

### Response

```json
{
  "class_info": {
    "id": "c1",
    "code": "CST4080",
    "name": "Software Engineering",
    "room": "CG76",
    "headcount": {"checked_in": 18, "total": 24}
  },
  "students": [
    {"id": "...", "name": "Alex Kumar", "initials": "AK"}
  ],
  "is_checked_in": true
}
```

---

## 🚨 Slice 5: Emergency

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/emergency/alert` | Send panic alert |
| GET | `/api/emergency/contacts` | Security contacts |

### Test

```bash
curl -X POST http://localhost:8000/api/emergency/alert \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"lat": 51.5899, "lng": -0.2284}'
```

---

## 📍 Slice 6: Location & Friends

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/location/update` | Update my location |
| GET | `/api/location/friends` | Friends' locations |
| GET | `/api/location/buildings` | Building occupancy |

---

## 🧪 Demo Credentials

| Email | Password | User |
|-------|----------|------|
| `ak1234@live.mdx.ac.uk` | `demo123` | Alex Kumar |
| `sj5678@live.mdx.ac.uk` | `demo123` | Sarah Johnson |
| `mp9012@live.mdx.ac.uk` | `demo123` | Mike Patel |

---

## 🗄️ Database Schema

```
users          → id, email, name, password_hash, visibility_level
buildings      → id, name, short_code, lat, lng
classes        → id, code, name, room, building_id, day_of_week, times
enrollments    → user_id, class_id
checkins       → id, user_id, class_id, checked_in_at, method
locations      → user_id, building_id, lat, lng, updated_at
friends        → user_id, friend_id, status
```
