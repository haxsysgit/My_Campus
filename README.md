# 🎓 MyCampus

> **Navigate. Connect. Stay Safe.**

A Progressive Web App for Middlesex University students combining campus navigation, smart attendance (ClassPulse), and safety features.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-hackathon-orange.svg)

## 🚀 Features

### 🗺️ Navigation
- Interactive campus map with all buildings
- Fastest & safest route options
- Real-time building search

### 👥 ClassPulse (Social)
- See today's classes with live attendance
- QR code check-in (replaces manual roll call)
- View classmates' locations (opt-in)
- Friend system with location sharing

### 🛡️ Safety
- Emergency panic button (alerts security with GPS)
- Night-safe route suggestions
- Share live location with friends
- Building occupancy info

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, TailwindCSS, Leaflet.js |
| **Backend** | FastAPI, SQLAlchemy, SQLite |
| **Auth** | JWT (python-jose) |
| **Platform** | PWA (installable on mobile) |

## 📁 Project Structure

```
My_Campus/
├── backend/                 # FastAPI server
│   ├── app/
│   │   ├── main.py          # Entry point
│   │   ├── config.py        # Settings
│   │   ├── database.py      # DB connection
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── routers/         # API routes
│   │   └── services/        # Business logic
│   ├── requirements.txt
│   └── seed_data.py         # Demo data
│
├── frontend/                # Next.js PWA
│   ├── app/                 # App Router pages
│   ├── components/          # React components
│   ├── lib/                 # API client, utils
│   └── public/              # Static assets
│
├── IMPLEMENTATION.md        # Technical specs
├── HACKATHON_DECISION.md    # Project decisions
└── hackathon.pen            # UI designs
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

App available at: http://localhost:3000

## 🔑 Demo Credentials

| Email | Password |
|-------|----------|
| `ak1234@live.mdx.ac.uk` | `demo123` |
| `sj5678@live.mdx.ac.uk` | `demo123` |

## 📱 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| GET | `/api/classes/today` | Today's classes |
| POST | `/api/checkin/qr` | QR check-in |
| GET | `/api/location/friends` | Friends' locations |
| POST | `/api/emergency/alert` | Send emergency alert |

See full API docs at `/docs` when backend is running.

## 👥 Team

Built for the Middlesex University Hackathon 2024.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.
