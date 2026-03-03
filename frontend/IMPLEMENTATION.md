# 🎨 MyCampus Frontend Implementation

> Vite + React + TypeScript + shadcn/ui + Framer Motion

---

## 📦 Git Commit Strategy

| After | Commit Message |
|-------|----------------|
| Initial | `feat: switch to Lovable frontend (Vite + shadcn)` |
| API Integration | `feat: connect frontend to FastAPI backend` |
| Auth Flow | `feat: add login/logout with JWT` |
| Map Integration | `feat: add Leaflet map with routing` |

---

## 🏗️ Tech Stack

- **Vite** - Fast build tool with HMR
- **React 18** - UI framework
- **TypeScript** - Type safety
- **shadcn/ui** - 49 pre-built components
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Icons
- **React Router** - Client-side routing

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn components (49)
│   │   ├── ClassCard.tsx
│   │   ├── Navbar.tsx
│   │   └── ...
│   ├── context/
│   │   └── AppContext.tsx   # Global state
│   ├── hooks/
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── api.ts           # FastAPI client
│   │   ├── campusData.ts    # Building/room data
│   │   ├── pathfinding.ts   # Route calculation
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Index.tsx        # Home/Dashboard
│   │   ├── Navigate.tsx     # Map screen
│   │   ├── ClassPulse.tsx   # Classes list
│   │   ├── ClassDetail.tsx  # Class + QR check-in
│   │   └── Emergency.tsx    # Safety features
│   ├── App.tsx
│   └── main.tsx
├── public/
├── .env                     # VITE_API_URL
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── tsconfig.json
```

---

## 🚀 Quick Start

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:8000

---

## 🔌 API Integration

The frontend connects to FastAPI backend via `src/lib/api.ts`:

```typescript
import { api } from '@/lib/api'

// Login
const { user, token } = await api.login(email, password)

// Get today's classes
const classes = await api.getTodaysClasses()

// Check in with QR
await api.checkInWithQR(qrCode)

// Emergency alert
await api.sendEmergencyAlert(lat, lng, message)
```

---

## 🎨 Design System

Using shadcn/ui components with custom theme:

- **Primary**: Blue (#3B82F6)
- **Accent**: Green (#22C55E)
- **Destructive**: Red (#EF4444)
- **Font**: Inter

---

## 📱 Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Index | Dashboard with quick actions |
| `/navigate` | Navigate | Campus map with routing |
| `/classpulse` | ClassPulse | Today's classes |
| `/class/:code` | ClassDetail | Class details + QR check-in |
| `/emergency` | Emergency | Safety features |

---

## ✅ Demo Credentials

- **Email**: `ak1234@live.mdx.ac.uk`
- **Password**: `demo123`
