# Middlesex University Hackathon - Brief Analysis & Decision

## Team Composition
| Member | Skills |
|--------|--------|
| **Member 1 (You)** | APIs, FastAPI, Python backend |
| **Member 2** | Frontend UI/UX, React, Next.js |
| **Member 3** | (To be specified) |

---

## 📋 ALL BRIEFS OVERVIEW

### Brief 1: Smart Navigation
> "Our campus is large, confusing and inefficient to move around. Help!"

| Core Features | Extensions |
|---------------|------------|
| Indoor navigation system | AI/ML traffic control |
| Accessibility options | Predictive movement modelling |
| Timetable awareness for route planning | Emergency re-routing (fire alarms, police) |
| Empty classroom/study space finder | |

---

### Brief 2: Student Life Assistant
> "When struggling with organisation, wellbeing and engagement..."

| Core Features | Extensions |
|---------------|------------|
| Track studies, deadlines, meetings, classes | LLM/Chatbot integration |
| Timetable management | Voice integration |
| Campus + home engagement tracking | Predicting academic risk |
| Chatbot for campus support | |
| Mental health/wellbeing checks | |

---

### Brief 3: Safety and Security on Campus
> "Proactive and Intelligent Safety Systems"

| Core Features | Extensions |
|---------------|------------|
| Authenticate students (facial recognition, etc.) | AI anomaly detection |
| Contact security, building usage alerts | Lockdown options |
| Total users in building tracking | Predictive safety analytics |
| Entry/exit logging | |
| Safe at-night route planning, panic options | |

---

### Brief 4: Conceptual Sustainability (Design Only)
> "For students not wanting to create a system with code..."

| Core Features | Extensions |
|---------------|------------|
| Building energy usage dashboard | IoT sensor integration |
| Smart classroom power control | Predictive energy usage |
| Room occupancy optimisation | |
| Solar production tracking | |

**Note:** Brief 4 is design/prototype only (Figma) — not suitable for your coding team.

---

## 🎯 MARKING CRITERIA (100 Marks Total)

| Criteria | Marks | Notes |
|----------|-------|-------|
| **Problem Definition and Vision** | 15 | Clear problem statement |
| **Technical Implementation** | 25 | Working code! |
| **Innovation and Creativity** | 15 | Unique features win here |
| **Feasibility and Scalability** | 10 | Can it grow? |
| **Data Usage** | 10 | How you use/display data |
| **Ethics and Security** | 10 | Privacy considerations |
| **User Experience and Design** | 10 | UI/UX quality |
| **Presentation** | 5 | 10-min pitch |

**Key Insight:** Innovation (15) + Technical (25) = 40 marks — combining briefs + unique features is the winning strategy!

---

## 🔗 Combined Solution: "MyCampus Navigator"

### Concept
A **unified campus companion app** that combines **safe navigation** with **intelligent security** AND **social awareness** — helping students move around campus efficiently, stay safe, and connect with classmates.

### 🌟 CREATURE FEATURE: "ClassPulse" - Social Location & Smart Attendance

**This is your differentiator!** A social layer that solves real problems:

#### The Problems It Solves
1. **"Where are my classmates?"** - See where students in your class are located (opt-in)
2. **"Is anyone else going to the lecture?"** - Visual heat map of class attendance
3. **"Attendance is broken"** - Automated check-in replaces manual roll call
4. **"The lecturer wastes 10 mins on headcount"** - Instant accurate headcount

---

## 📱 PLATFORM DECISION: Progressive Web App (PWA)

### Why PWA over Native Mobile App?

| Factor | Native App | PWA (Our Choice) |
|--------|-----------|------------------|
| Development time | 2-3x longer | Single codebase ✅ |
| App Store approval | Days/weeks | Instant deploy ✅ |
| Works on desktop | No | Yes ✅ |
| Install required | Yes | Optional ✅ |
| Offline support | Yes | Yes (service workers) ✅ |
| Push notifications | Yes | Yes ✅ |
| Camera/QR access | Yes | Yes ✅ |
| GPS/Location | Yes | Yes ✅ |
| Team skills | Need Swift/Kotlin | React/Next.js ✅ |

**Verdict:** PWA gives us mobile app UX with web app development speed. Perfect for a 24-hour hackathon!

### Tech Stack
```
Frontend: Next.js 14 + TailwindCSS + PWA manifest
Backend:  FastAPI + PostgreSQL
Deploy:   Vercel (frontend) + Railway (backend)
```

---

## 🔗 SOCIAL SYSTEM: How ClassPulse Actually Works

### User Levels & Trust

```
┌────────────────────────────────────────────────────────────────┐
│                    SOCIAL VISIBILITY LEVELS                     │
├────────────────────────────────────────────────────────────────┤
│  LEVEL 1: Anonymous (Default)                                   │
│  • Others see: "5 students in College Building"                 │
│  • Your name: Hidden                                            │
│  • Use case: Privacy-conscious users                            │
├────────────────────────────────────────────────────────────────┤
│  LEVEL 2: Class Visible                                         │
│  • Others see: "Sarah is in CG76" (classmates only)            │
│  • Your name: Shown to same-class students                      │
│  • Use case: "Is anyone in my lecture?"                         │
├────────────────────────────────────────────────────────────────┤
│  LEVEL 3: Friends Visible                                       │
│  • Others see: Full location to approved friends                │
│  • Your name: Shown to friend list                              │
│  • Use case: Meet up with friends on campus                     │
└────────────────────────────────────────────────────────────────┘
```

### Social Features Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLASSPULSE SOCIAL FLOW                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📱 STUDENT A opens app                                          │
│       │                                                          │
│       ▼                                                          │
│  ┌─────────────────┐                                             │
│  │ Today's Classes │ ← Synced from university timetable          │
│  │ • 09:00 CST4080 │                                             │
│  │ • 11:00 CST3130 │                                             │
│  └────────┬────────┘                                             │
│           │                                                      │
│           ▼ Tap on CST4080                                       │
│  ┌─────────────────────────────────────────────┐                 │
│  │ CST4080 - Software Engineering              │                 │
│  │ Room: CG76 (College, Ground, Room 76)       │                 │
│  │ ──────────────────────────────────────────  │                 │
│  │ 📊 Live Stats:                              │                 │
│  │    • 18/24 checked in                       │                 │
│  │    • 3 students heading there now           │                 │
│  │ ──────────────────────────────────────────  │                 │
│  │ 👥 Classmates (if Level 2+):               │                 │
│  │    • Alex K. ✅ Checked in                  │                 │
│  │    • Sarah J. 🚶 Walking (2 min away)       │                 │
│  │    • Mike P. ❓ Not sharing                 │                 │
│  └─────────────────────────────────────────────┘                 │
│           │                                                      │
│           ▼ Student arrives at room                              │
│  ┌─────────────────────────────────────────────┐                 │
│  │ 📷 SCAN QR CODE TO CHECK IN                 │                 │
│  │                                              │                 │
│  │     ┌─────────────┐                          │                 │
│  │     │ [QR CODE]   │  ← Displayed by lecturer │                 │
│  │     │             │    or on room door       │                 │
│  │     └─────────────┘                          │                 │
│  │                                              │                 │
│  │ ✅ Checked in at 09:02                       │                 │
│  └─────────────────────────────────────────────┘                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Friend System

```
ADD FRIEND FLOW:
1. Student A searches for "Sarah Johnson" or scans friend's QR
2. Request sent: "Alex wants to connect with you"
3. Sarah accepts → Now mutual friends
4. Both can see each other's location (if sharing enabled)

SAFETY FEATURE:
- "Share my location for 1 hour" (time-limited)
- "I'm walking home late, track me" (safety mode)
- Emergency auto-shares location to all friends + security
```

### Attendance Check-in Methods

| Method | How it Works | Pros | Cons |
|--------|-------------|------|------|
| **QR Scan** (MVP) | Lecturer displays QR, student scans | Simple, works everywhere | Need phone + camera |
| **Geofence** | Auto check-in when GPS enters room | Hands-free | GPS inaccurate indoors |
| **Bluetooth** | Beacon in room triggers check-in | Very accurate | Need hardware |
| **Wi-Fi** | Connect to room's Wi-Fi | No extra hardware | Unreliable |

**MVP:** QR code scan only. Extension: Add geofence for auto-detect.

#### Privacy Controls (Critical for Ethics marks!)
- **Opt-in only** - Students choose to share location
- **Class-only visibility** - Only classmates see you
- **Time-limited** - Location sharing during class hours only
- **Anonymized option** - Show as "3 students heading to CG76" not names
- **Instant off** - One tap to go invisible
- **GDPR compliant** - Data deletion on request

#### Which Briefs Does This Touch?
| Feature | Brief 1 | Brief 2 | Brief 3 |
|---------|---------|---------|---------|
| Timetable integration | ✅ | ✅ | |
| Campus engagement tracking | | ✅ | |
| Building occupancy/headcount | | | ✅ |
| Know where students are | ✅ | | ✅ |
| Attendance tracking | | ✅ | ✅ |

**Verdict:** This feature **bridges all 3 technical briefs** — massive innovation points!

---

### Synergies Between Brief 1, 2 & 3
| Feature | Brief 1 | Brief 2 | Brief 3 | Combined Value |
|---------|---------|---------|---------|----------------|
| Route Planning | ✅ Quickest path | | ✅ Safe routes | **Fast AND safe routes** |
| Timetable | ✅ Route planning | ✅ Class tracking | | **Auto-navigate to next class** |
| Building Awareness | ✅ Indoor nav | | ✅ Occupancy | **Where + who's there** |
| Attendance | | ✅ Engagement | ✅ Entry/exit | **Smart check-in system** |
| Emergency | ✅ Re-routing | | ✅ Panic/alarms | **Complete safety system** |
| Social | | ✅ Campus engagement | ✅ User tracking | **ClassPulse feature** |

### Unified Feature Set

#### MVP (Minimum Viable Product) - Hackathon Demo
1. **Smart Campus Map** - Interactive map with building locations
2. **Route Planning** - A* or Dijkstra pathfinding between locations
3. **Safety Mode Toggle** - Switch between "fastest" and "safest" route
4. **ClassPulse Check-in** - QR code scan to log class attendance
5. **Live Headcount** - Real-time count of students in each class/building
6. **Class Locator** - See where students in your class are (anonymized)
7. **Emergency Alert Button** - Quick panic/alert feature

#### Extensions (If Time Permits)
- Timetable integration (auto-navigate to next class)
- "Who's going?" - See classmates heading to same lecture
- Lecturer dashboard (attendance export, headcount)
- Night mode (well-lit paths, emergency phone locations)
- Friend location sharing (opt-in safety feature)

---

## 🏆 Ranking & Recommendation

### Option Ranking

| Rank | Option | Feasibility | Impact | Innovation | Team Fit | Total |
|------|--------|-------------|--------|------------|----------|-------|
| **1** | **Combined (1+2+3) + ClassPulse** | 7/10 | 10/10 | 10/10 | 9/10 | **36/40** |
| 2 | Combined (1+3) only | 8/10 | 8/10 | 7/10 | 9/10 | 32/40 |
| 3 | Brief 1 Only | 9/10 | 6/10 | 5/10 | 8/10 | 28/40 |
| 4 | Brief 3 Only | 8/10 | 7/10 | 5/10 | 7/10 | 27/40 |
| 5 | Brief 2 Only | 9/10 | 6/10 | 4/10 | 8/10 | 27/40 |

### Why Combined (1+2+3) + ClassPulse Wins
- ✅ **Maximum innovation points** - Combining 3 briefs is bold and creative
- ✅ **ClassPulse is unique** - No other team will have social attendance
- ✅ **Solves REAL pain** - Attendance is genuinely broken at universities
- ✅ **More demo features** - Map + attendance + safety = impressive demo
- ✅ **Ethics story** - Privacy controls show mature thinking (10 marks!)
- ✅ **Scalable** - Works for any university campus

---

## 👥 Task Division

### Member 1: Backend (You - FastAPI/Python)
**Core APIs:**
- [ ] FastAPI project setup with Pydantic models
- [ ] User authentication (JWT tokens)
- [ ] Campus map data structure (nodes + edges)
- [ ] Pathfinding algorithm (A* or Dijkstra)

**ClassPulse APIs:**
- [ ] `/classes` - Get user's timetable/classes
- [ ] `/classes/{id}/checkin` - Check into a class (QR code validation)
- [ ] `/classes/{id}/headcount` - Get live count for a class
- [ ] `/classes/{id}/students` - Get anonymized student locations (opt-in)
- [ ] `/buildings/{id}/occupancy` - Building occupancy count

**Safety APIs:**
- [ ] `/emergency/alert` - Panic button endpoint
- [ ] `/route` - Pathfinding with safety mode toggle

### Member 2: Frontend (React/Next.js)
**Core UI:**
- [ ] Next.js project setup + TailwindCSS + shadcn/ui
- [ ] Interactive campus map (Leaflet.js or Mapbox)
- [ ] Route visualization overlay on map

**ClassPulse UI:**
- [ ] Timetable view (today's classes)
- [ ] Class detail page (who's checked in, headcount)
- [ ] QR code scanner for check-in
- [ ] "X students heading to this class" indicator

**Safety UI:**
- [ ] Emergency alert button (big, red, obvious)
- [ ] Safety mode toggle on route planning
- [ ] Mobile-responsive design

### Member 3: (Data/Integration/Presentation)
- [ ] Collect Middlesex campus building coordinates
- [ ] Create sample timetable data (JSON)
- [ ] Generate QR codes for demo classrooms
- [ ] UI/UX wireframes (quick sketches)
- [ ] Prepare demo script and presentation slides
- [ ] Architecture diagram for presentation
- [ ] Ethics & privacy documentation

---

## 🛠️ Tech Stack

### Backend
```
FastAPI + Python
├── Pydantic (data validation)
├── SQLite or PostgreSQL (if time)
├── NetworkX (graph/pathfinding)
└── JWT (authentication)
```

### Frontend
```
Next.js + React
├── TailwindCSS (styling)
├── Leaflet.js or React-Map-GL (maps)
├── Lucide Icons
└── shadcn/ui (components)
```

### Infrastructure
```
├── Backend: Render / Railway / local
├── Frontend: Vercel
└── Database: SQLite file (simplest for hackathon)
```

---

## 📅 Suggested Timeline

| Time | Task |
|------|------|
| **Hour 1-2** | Setup repos, define API contracts, create campus data |
| **Hour 3-4** | Backend: Auth + Pathfinding | Frontend: Map + Basic UI |
| **Hour 5-6** | Backend: Check-in/Occupancy | Frontend: Dashboard |
| **Hour 7-8** | Integration + Emergency features |
| **Hour 9-10** | Polish, bug fixes, demo prep |
| **Final Hour** | Practice pitch, prepare screenshots |

---

## ✅ Final Decision

### We are building: **MyCampus Navigator + ClassPulse**
> A combined Brief 1 + Brief 2 + Brief 3 solution

**Tagline:** *"Navigate smart. Stay safe. Stay connected."*

### Core Pitch (30 seconds)
> "Students at Middlesex face three problems: getting lost on a confusing campus, feeling unsafe at night, and sitting through 10 minutes of manual attendance every lecture. MyCampus Navigator with ClassPulse solves all three. Navigate to your next class with the fastest OR safest route. See how many classmates are already there. Check in with a QR scan — no more roll call. And if you ever feel unsafe, one tap alerts security with your exact location. It's navigation, safety, and smart attendance — in one app."

### Elevator Pitch (10 seconds)
> "Campus navigation + smart attendance + safety alerts. One app. ClassPulse."

---

## 🚀 Next Steps

1. [ ] Confirm team agreement on combined approach
2. [ ] Create GitHub repo
3. [ ] Set up FastAPI backend skeleton
4. [ ] Set up Next.js frontend skeleton
5. [ ] Gather Middlesex campus building coordinates
6. [ ] Define API contract (OpenAPI spec)
7. [ ] Start building!

---

*Generated: March 3, 2026 | Middlesex CS Student Hackathon*
