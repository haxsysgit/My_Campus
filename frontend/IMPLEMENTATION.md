# 🎨 MyCampus Frontend Implementation

> Next.js 14 + TailwindCSS + PWA (JavaScript)

---

## 📦 Git Commit Strategy

Commit after each completed slice to maintain a clean history.

| After | Commit Message |
|-------|----------------|
| Slice 0 | `feat: setup Next.js with layout and bottom nav` |
| Slice 1 | `feat: add login page with auth flow` |
| Slice 2 | `feat: add ClassPulse screen with today's classes` |
| Slice 3 | `feat: add class detail with QR check-in` |
| Slice 4 | `feat: add home map screen` |
| Slice 5 | `feat: add safety/emergency screen` |
| Slice 6 | `feat: add profile and friends screens` |

```bash
git add .
git commit -m "feat: <slice description>"
git push origin main
```

---

## 🏗️ Build Order: Vertical Slices

Build **screen-by-screen** matching the backend slices. Each slice = working feature.

| Slice | Screen | Backend Needed | Status |
|-------|--------|----------------|--------|
| 0 | **Setup** - Next.js + Layout + BottomNav | - | ⏳ Pending |
| 1 | **Login** - Auth form | `/api/auth/login` | ⏳ Pending |
| 2 | **ClassPulse** - Today's classes list | `/api/classes/today` | ⏳ Pending |
| 3 | **Class Detail** - Info + QR check-in | `/api/classes/{id}`, `/api/checkin/qr` | ⏳ Pending |
| 4 | **Home Map** - Campus navigation | `/api/location/buildings` | ⏳ Pending |
| 5 | **Safety** - Emergency button | `/api/emergency/alert` | ⏳ Pending |
| 6 | **Profile** - Settings + friends | `/api/location/friends` | ⏳ Pending |

---

## 📱 Screens from hackathon.pen

| # | Screen Name | Key Components |
|---|-------------|----------------|
| 1 | Home - Map | Map, Search, Route toggle, Quick actions, Bottom nav |
| 2 | ClassPulse | Header + scan btn, Class cards, Attendance stats |
| 3 | Safety | Emergency button, Safety options grid |
| 4 | Class Detail | Class info card, QR check-in, Students list |
| 5 | Profile & Settings | Avatar, Visibility toggles, Friends list |
| 6 | Friend Locations | Map with friend pins, Active friends list |

---

## 📁 Project Structure

```
frontend/
├── app/
│   ├── layout.jsx           # Root layout + BottomNav
│   ├── page.jsx             # Home/Map (Screen 1)
│   ├── login/page.jsx       # Login form
│   ├── classes/
│   │   ├── page.jsx         # ClassPulse list (Screen 2)
│   │   └── [id]/page.jsx    # Class detail (Screen 4)
│   ├── safety/page.jsx      # Safety center (Screen 3)
│   ├── profile/page.jsx     # Profile & settings (Screen 5)
│   └── friends/page.jsx     # Friend locations (Screen 6)
├── components/
│   ├── BottomNav.jsx
│   ├── ClassCard.jsx
│   ├── EmergencyButton.jsx
│   ├── QRScanner.jsx
│   └── MapView.jsx
├── lib/
│   └── api.js               # API client
├── public/
│   └── manifest.json        # PWA manifest
├── tailwind.config.js
└── package.json
```

---

## 🎨 Design Tokens (from hackathon.pen)

```javascript
// tailwind.config.js
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
}
fontFamily: {
  sans: ['DM Sans', 'sans-serif'],
}
```

---

## 🚀 Slice 0: Project Setup

### Steps
1. Create Next.js app with TypeScript
2. Install TailwindCSS
3. Setup design tokens
4. Create root layout with BottomNav
5. Add PWA manifest

### Commands
```bash
npx create-next-app@14 frontend --typescript --tailwind --app --no-src-dir
cd frontend
npm install lucide-react
```

### Files to Create
- `app/layout.tsx` - Root layout
- `components/BottomNav.tsx` - Navigation bar
- `tailwind.config.js` - Design tokens
- `public/manifest.json` - PWA config

---

## 🔐 Slice 1: Login Screen

### Design Reference
- Simple centered form
- Email + Password inputs
- "Sign In" button (accent-blue)
- MDX branding

### Components
- `app/login/page.tsx`
- `lib/api.ts` - API client with login method
- `lib/auth.tsx` - Auth context + token storage

### API Integration
```typescript
// Login flow
const { token, user } = await api.login(email, password)
localStorage.setItem('token', token)
router.push('/classes')
```

---

## 📚 Slice 2: ClassPulse Screen

### Design Reference (Screen 2 from hackathon.pen)
- Header: "ClassPulse" + QR scan button
- Section: "Today's Classes"
- Class cards with: code, name, time, room, attendance bar
- Section: "Your Attendance" stats

### Components
- `app/classes/page.tsx`
- `components/ClassCard.tsx`

### API Integration
```typescript
const classes = await api.getTodaysClasses()
// Returns: [{id, code, name, room, start_time, headcount}]
```

---

## 📱 Slice 3: Class Detail + QR Check-in

### Design Reference (Screen 4 from hackathon.pen)
- Back button + "Class Details" header
- Blue info card: name, time, room, attendance bar
- QR scan area with phone icon
- "Scan to Check In" button
- "Checked In Students" list

### Components
- `app/classes/[id]/page.tsx`
- `components/QRScanner.tsx`

### API Integration
```typescript
// Get class detail
const detail = await api.getClassDetail(id)

// Check in
const result = await api.checkIn(qrCode)
```

---

## 🗺️ Slice 4: Home Map Screen

### Design Reference (Screen 1 from hackathon.pen)
- Header: Logo + Bell icon
- Map area with building pins
- Search bar
- Route toggle: Fastest | Safest
- Quick actions: Next Class, ClassPulse, Emergency

### Components
- `app/page.tsx`
- `components/MapView.tsx` (Leaflet)

### API Integration
```typescript
const buildings = await api.getBuildings()
// For now: static campus map image
```

---

## 🚨 Slice 5: Safety Screen

### Design Reference (Screen 3 from hackathon.pen)
- Header: "Safety Center"
- Large red emergency button (hold to alert)
- Safety options grid:
  - Night Safe Route
  - Share My Location
  - Contact Security
  - Building Occupancy

### Components
- `app/safety/page.tsx`
- `components/EmergencyButton.tsx`

### API Integration
```typescript
await api.sendEmergencyAlert(lat, lng)
```

---

## 👤 Slice 6: Profile & Friends

### Design Reference (Screen 5 + 6 from hackathon.pen)
- User avatar + name
- Visibility level toggles (Anonymous/Class/Friends)
- Friends section with avatar stack
- Friend locations map

### Components
- `app/profile/page.tsx`
- `app/friends/page.tsx`

### API Integration
```typescript
const friends = await api.getFriendsLocations()
await api.updateVisibility(level)
```

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "next": "14.1.0",
    "react": "18.2.0",
    "lucide-react": "^0.312.0",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "html5-qrcode": "^2.3.8"
  }
}
```

---

## 🧪 Testing Each Slice

After each slice, verify:
1. **UI matches hackathon.pen design**
2. **API calls work** (check Network tab)
3. **Error states handled** (loading, error messages)
4. **Mobile responsive** (390px width)
