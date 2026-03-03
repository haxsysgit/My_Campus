# 🚀 MyCampus Hackathon Progress

> **Deadline:** 3 hours remaining (scoring at 5:30pm)
> **Last Updated:** 3 March 2026, 2:30pm

---

## ⏱️ Time Budget

| Task | Est. Time | Priority |
|------|-----------|----------|
| Connect ClassPulse to API | 15 min | 🔴 HIGH |
| Connect ClassDetail + QR | 20 min | 🔴 HIGH |
| Add Login page | 20 min | 🔴 HIGH |
| Connect Navigate map | 30 min | 🟡 MED |
| Connect Emergency | 15 min | 🟡 MED |
| Polish & test | 30 min | 🟡 MED |
| Demo prep | 30 min | 🟢 LOW |
| **Buffer** | 60 min | - |

---

## ✅ Completed

### Backend (100% Done)
- [x] Slice 1: Auth (login/register/me)
- [x] Slice 2: Classes (today's classes)
- [x] Slice 3: QR Check-in
- [x] Slice 4: Class Detail
- [x] Slice 5: Emergency alerts
- [x] Slice 6: Location & Friends
- [x] Seed data with demo users

### Frontend Setup (100% Done)
- [x] Vite + React + TypeScript
- [x] shadcn/ui components (49)
- [x] Tailwind with dark theme
- [x] API client (`src/lib/api.ts`)
- [x] Router setup

### Design (100% Done)
- [x] hackathon.pen - dark theme screens
- [x] pencil-shadcn.pen - component library

---

## ✅ In Progress → DONE

### Frontend-Backend Integration (100%)

| Page | Status | Notes |
|------|--------|-------|
| **Login** | ✅ Done | Form with API auth, JWT stored |
| **Dashboard** | ✅ Done | Protected route |
| **ClassPulse** | ✅ Done | Fetches from `api.getTodaysClasses()` |
| **ClassDetail** | ✅ Done | Fetches from `api.getClassDetail()`, QR check-in |
| **Navigate** | ✅ Done | Map with mock buildings (sufficient for demo) |
| **Emergency** | ✅ Done | Calls `api.sendEmergencyAlert()` |

---

## 🎯 Sprint Plan (Next 3 Hours)

### Hour 1: Core Flow ✅ DONE
1. [x] Create Login page with email/password form
2. [x] Connect ClassPulse to `api.getTodaysClasses()`
3. [x] Connect ClassDetail to `api.getClassDetail()`
4. [ ] Test login → classes → check-in flow

### Hour 2: Complete Features ✅ DONE
5. [x] Add QR scanner to ClassDetail (or text input for demo)
6. [x] Connect Emergency page to API
7. [x] Add auth guards (redirect if not logged in)
8. [ ] Test full user journey

### Hour 3: Polish & Demo
9. [ ] Fix any bugs
10. [ ] Prepare demo script
11. [ ] Test on mobile viewport
12. [ ] Final commit

---

## 🧪 Test Commands

```bash
# Backend
cd backend && uvicorn app.main:app --reload

# Frontend
cd frontend && npm run dev

# Test login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ak1234@live.mdx.ac.uk","password":"demo123"}'
```

---

## 📝 Demo Script

1. Open app → Login as Alex Kumar
2. Show Dashboard with quick actions
3. Go to ClassPulse → see today's classes
4. Tap class → ClassDetail with headcount
5. Scan QR / tap Check-in → see count update
6. Navigate → show route between buildings
7. Emergency → hold panic button (don't actually trigger)

---

## 🔑 Demo Credentials

| Email | Password | User |
|-------|----------|------|
| `ak1234@live.mdx.ac.uk` | `demo123` | Alex Kumar |

---

## 📊 Score Focus

For hackathon scoring, prioritize:
1. **Working login flow** - proves auth works
2. **Real-time class data** - proves API integration
3. **QR check-in** - the killer feature
4. **Dark theme UI** - polished look
5. **Emergency button** - safety angle

---

*Update this file as you complete tasks!*
