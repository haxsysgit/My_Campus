# MyCampus Deployment Guide

## Quick Start (Local Demo)

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.11+ with `uv` package manager
- Git

### 1. Clone & Setup

```bash
git clone <repository-url>
cd hackathon3326
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
uv sync

# Seed the database with demo data
uv run python seed_data.py

# Start the API server
uv run fastapi dev app/main.py --port 8000
```

The backend will be running at `http://localhost:8000`
- API docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

### 3. Frontend Setup (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be running at `http://localhost:8080`

### 4. Demo Credentials

```
Email: ak1234@live.mdx.ac.uk
Password: demo123
Student ID: M01081164
```

---

## Production Deployment

### Option A: Vercel + Railway (Recommended)

#### Frontend on Vercel

1. Push code to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Set environment variable:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
4. Deploy

#### Backend on Railway

1. Connect repo to [Railway](https://railway.app)
2. Set root directory to `backend/`
3. Railway auto-detects FastAPI
4. Set environment variables:
   ```
   DATABASE_URL=sqlite:///./campus.db
   SECRET_KEY=your-secret-key-here
   ```
5. Deploy

### Option B: Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=sqlite:///./campus.db
      - SECRET_KEY=your-secret-key
    volumes:
      - ./data:/app/data

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=http://backend:8000
    depends_on:
      - backend
```

### Option C: University Server

For Middlesex University IT deployment:

1. **Backend**: Deploy as systemd service on Ubuntu server
   ```bash
   # /etc/systemd/system/mycampus-api.service
   [Unit]
   Description=MyCampus API
   After=network.target

   [Service]
   User=www-data
   WorkingDirectory=/var/www/mycampus/backend
   ExecStart=/usr/local/bin/uv run uvicorn app.main:app --host 0.0.0.0 --port 8000
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

2. **Frontend**: Build and serve via Nginx
   ```bash
   cd frontend && npm run build
   # Copy dist/ to /var/www/mycampus/frontend
   ```

3. **Nginx config**:
   ```nginx
   server {
       listen 80;
       server_name mycampus.mdx.ac.uk;

       location / {
           root /var/www/mycampus/frontend;
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
       }
   }
   ```

---

## Environment Variables

### Backend
| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | SQLite/PostgreSQL connection | `sqlite:///./campus.db` |
| `SECRET_KEY` | JWT signing key | Required in production |
| `CORS_ORIGINS` | Allowed frontend origins | `*` |

### Frontend
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |

---

## Database

### Reset & Reseed
```bash
cd backend
rm -f campus.db
uv run python seed_data.py
```

### Production Database
For production, consider PostgreSQL:
```
DATABASE_URL=postgresql://user:pass@host:5432/mycampus
```

---

## Presentation Demo Checklist

Before the presentation:

1. ✅ Backend running (`uv run fastapi dev app/main.py`)
2. ✅ Frontend running (`npm run dev`)
3. ✅ Database seeded with demo data
4. ✅ Test login with demo credentials
5. ✅ Test ClassPulse → click a class → check-in
6. ✅ Test Navigate → building markers visible
7. ✅ Test seat map in class detail view
8. ✅ Prepare backup: screenshots/video in case of issues

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Class not found" on check-in | Re-run `seed_data.py` |
| CORS errors | Ensure backend allows frontend origin |
| Port already in use | Kill existing process or use different port |
| Database locked | Stop all backend processes, delete `.db` file |

---

## Support

Built for Middlesex University Hackathon 2026
Team: MyCampus

