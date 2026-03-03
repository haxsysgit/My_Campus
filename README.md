# 🎓 MyCampus

> **Navigate. Connect. Stay Safe.**

A smart campus companion for Middlesex University students — combining interactive campus navigation, social attendance tracking (ClassPulse), real-time room occupancy monitoring, and campus safety features.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Hackathon](https://img.shields.io/badge/Middlesex%20Hackathon-2026-blue.svg)
![Status](https://img.shields.io/badge/status-live%20demo-brightgreen.svg)

## 🚀 Features

### 🗺️ Interactive Campus Map
- Full Middlesex Hendon campus map (10 buildings + Ravensfield)
- Click any building to see room occupancy, description, and quick navigation
- **Occupancy-coded markers**: green (Available) → yellow (Filling Up) → orange (Mildly Crowded) → red (Overcrowded)
- Hover a building to see live status label
- Fastest & safest route planner with walking time
- Route visualised on map as animated path
- Safety mode avoids unlit paths

### 👥 ClassPulse — Smart Attendance
- Today's classes at a glance with live headcount
- QR code check-in (one scan = marked present)
- Manual check-in fallback
- **Classroom seat map** — visual grid showing who is sitting where
- Classmates list with student IDs (e.g. M01081164)
- Privacy-controlled visibility (Anonymous / Class Visible / Friends Visible)

### 🪑 Room Occupancy Monitor
- Real-time seat availability per room
- Status labels: Empty · Available · Filling Up · Mildly Crowded · Overcrowded
- Helps students find quiet spaces before commuting to a building

### 🛡️ Safety
- Emergency panic button in navbar — alerts security with location
- Safe route mode avoids unlit/unsafe paths
- Emergency building lock-down mode on map
- User profile with school ID verification

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + TypeScript, TailwindCSS, shadcn/ui, Framer Motion |
| **Backend** | FastAPI, SQLAlchemy, SQLite → PostgreSQL ready |
| **Auth** | JWT (python-jose), bcrypt |
| **Icons** | Lucide React |
| **QR** | qrcode (generation), html5-qrcode (scanning) |

## 📁 Project Structure

```
hackathon3326/
├── backend/                 # FastAPI server
│   ├── app/
│   │   ├── main.py          # Entry point + CORS
│   │   ├── config.py        # Settings
│   │   ├── database.py      # SQLAlchemy session
│   │   ├── models/          # User, Class, Checkin, Enrollment…
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   └── routers/         # auth, classes, checkin, location, emergency
│   └── seed_data.py         # Demo data seeder
│
├── frontend/                # React + Vite SPA
│   ├── src/
│   │   ├── pages/           # Navigate, ClassPulse, ClassDetail, Profile…
│   │   ├── components/      # Navbar, OccupancyBar, HeadcountRing…
│   │   ├── context/         # AppContext (global state)
│   │   └── lib/             # api.ts, campusData.ts, pathfinding.ts
│   └── public/              # campus-map.png, logo.svg
│
├── DEPLOY.md                # Deployment guide
├── PRESENTATION.md          # Pitch script & demo guide
├── GRADING.md               # Self-assessment rubric
├── HACKATHON_DECISION.md    # Design decisions log
└── hackathon.pen            # Pencil UI designs
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend

```bash
cd backend
uv sync                      # Install all deps
uv run python seed_data.py   # Load demo data
uv run fastapi dev app/main.py
```

API available at: http://localhost:8000  
Swagger docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App available at: http://localhost:8080

## 🔑 Demo Credentials

| Email | Password |
|-------|----------|
| `ak1234@live.mdx.ac.uk` | `demo123` |
| `sj5678@live.mdx.ac.uk` | `demo123` |

## 📱 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with university email |
| POST | `/api/auth/register` | Register new account |
| GET | `/api/auth/me` | Get current user profile |
| GET | `/api/classes/today` | Today's enrolled classes |
| GET | `/api/classes/{id}` | Class detail + checked-in students |
| POST | `/api/checkin/qr` | QR or manual check-in |
| GET | `/api/checkin/status/{id}` | Check-in status for a class |
| GET | `/api/location/friends` | Friends' locations |
| POST | `/api/location/update` | Update own location |
| POST | `/api/emergency/alert` | Send emergency alert |

Full interactive docs at `http://localhost:8000/docs`

## 👥 Team

Built for the **Middlesex University Hackathon 2026**.

*Navigate. Connect. Stay Safe.*

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.
