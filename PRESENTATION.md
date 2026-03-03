# MyCampus — Presentation Guide
### Middlesex University Hackathon 2026

---

## ⚡ QUICK-FIRE CHEAT SHEET
> Print this. Glance at it before you go up. These are the things you MUST say.

- **"We've all been there"** — open with a relatable story (full room, wrong building)
- **The app is LIVE** — real backend, real login, real data. Not a prototype.
- **Colour-coded map** — green = fine, red = stay away, it's that simple
- **One scan = checked in** — no more paper registers
- **Book your seat before you leave your bedroom**
- **The map on the dashboard tells you where to be and when**
- **Privacy is 100% in YOUR hands** — nobody sees you unless you say so
- **Panic button** — one tap, security knows exactly where you are
- **Ritterman = lectures. Ravensfield = student housing** — different shapes on map so you never mix them up
- **This can scale to every MDX campus worldwide** — London, Dubai, Malta, Mauritius
- **We built this in one hackathon** — imagine what a full team could do

---

## 🎯 The 30-Second Pitch
*Say this if someone asks "so what is it?" in the hallway.*

> "You know that feeling when you walk all the way to a lecture room and it's completely packed — or you realise you went to the wrong building? MyCampus fixes that. It's a campus app built specifically for Middlesex students. You open it, you can see which buildings are full before you even leave your seat, check in to class with a QR scan, book a seat in advance, and hit a panic button if you ever feel unsafe. It's Google Maps, student attendance, and a campus safety system — all in one."

---

## 🎬 Full Demo Script (5–7 minutes)

### BEFORE YOU START
- Make sure the app is open at: `http://localhost:8080`
- Backend must be running: `cd backend && uv run uvicorn app.main:app --port 8000`
- Login credentials ready: `ak1234@live.mdx.ac.uk` / `demo123`
- Seed the DB if needed: `uv run python seed_data.py`

---

### OPENING — Set the Scene (30 seconds)
*Standing at login screen. Look at the audience, not the screen.*

"Raise your hand if you've ever walked to a lecture room, got there, and it was already completely full."

*Pause. Let people react.*

"Or ended up at the wrong building — walked to Hatchcroft when you were supposed to be in Ritterman?"

*Pause.*

"Yeah. We've all done it. And honestly it's embarrassing and it wastes time. So we built MyCampus — a smart companion app designed specifically for MDX students. Let me show you."

*Log in with `ak1234@live.mdx.ac.uk` / `demo123`*

---

### STEP 1 — The Dashboard (45 seconds)
*You're now on the Dashboard.*

"The first thing you see after logging in is your personal dashboard. It greets you by name, shows today's date, and straight away tells you what your next class is and where it is."

*Point to the mini campus map in the middle of the dashboard.*

"But here's what's different — there's a **live campus map right here on the dashboard**. Every building has a colour dot. Green means the room's got space, yellow means it's filling up, orange means it's getting cramped, red means it's overcrowded. You know what you're walking into before you even put your shoes on."

*Point to the timetable list next to the map.*

"And your full timetable for the day is right there next to it. 9am in Ritterman, 11am in College Building, 2pm library. Tap any class and it takes you straight to the room detail. Tap the map icon and it navigates you there."

---

### STEP 2 — The Campus Map (90 seconds)
*Click Navigate in the navbar.*

"Now let's look at the full Navigate page. This is the actual Middlesex Hendon campus — not a generic map, this is OUR campus."

*Point to the building markers.*

"Every building has a marker. Academic buildings like Ritterman, College Building, the Library — they have **round markers**. You'll notice Ritterman is labelled R. The colours change based on how full the rooms inside are right now."

*Point to Ravensfield specifically.*

"Now — Ravensfield. That's student accommodation, not a lecture building. It has a **square purple marker** with a little H badge, so students don't accidentally try to navigate there for a lecture. Small thing, but when you're late and panicking, it matters."

*Hover over Ritterman.*

"Hover over any building — see that label popping up? That's the occupancy status. Mildly Crowded. Filling Up. Overcrowded. Plain English."

*Click on Ritterman to open the detail panel.*

"Click a building and this panel slides in from the side. You can see every room inside it, how many seats are taken, and a colour bar showing how full it is. No guessing."

*Click 'Navigate Here'.*

"Hit Navigate Here and the route appears on the map. The app calculates the fastest walking path between any two buildings. There's also a Safety Mode that avoids dark or less-used paths — useful at night."

---

### STEP 3 — ClassPulse & Checking In (90 seconds)
*Click ClassPulse in the navbar.*

"This is ClassPulse — our answer to the paper register."

*Point to today's classes.*

"Every class you're enrolled in shows up here. You can see how many students are already checked in — before you've even arrived. That's useful. If your mates are already there, you know it's the right room."

*Click on a class.*

"Inside the class, you get a full picture. Headcount ring at the top — let's say 12 out of 30 checked in. Underneath that, a **seat map** of the actual room. Blue square is you, teal squares are classmates who've already taken seats."

*Point to an empty seat.*

"Empty grey squares? Tap one. You can **book that seat in advance**. A little modal pops up confirming the row and seat number. Confirm it and it turns green with a tick. That seat is held for you."

"No more arriving late and standing by the door. You claim your seat from home."

*Show the check-in button.*

"To check in, you either scan the QR code the lecturer puts up — one scan, done — or you hit the manual check-in button if the camera doesn't cooperate. Attendance logged. No paper. No calling names out."

---

### STEP 4 — Profile & Privacy (30 seconds)
*Click Profile.*

"Every student has a profile. Name, university email, student ID — M-number. This is verified against your actual MDX credentials."

*Point to the visibility toggle.*

"More importantly — **privacy**. Three settings:
- **Anonymous**: You're invisible. Nobody knows you're there.
- **Class Visible**: Only students in your same class can see you.
- **Friends Visible**: Only people you've added as friends.

You choose. The app never shares your location without your permission. Full stop. GDPR compliant."

---

### STEP 5 — The Panic Button (20 seconds)
*Point to the red emergency button in the top navbar.*

"Last thing — and hopefully you never need it. That red button in the top bar. Hit it and within seconds, campus security gets an alert with your exact GPS location. The building you're near gets flagged on the map. Your nearby friends get notified too."

"We take student safety seriously. That's not an afterthought — it's built into the main navigation."

---

### CLOSING — Leave Them Thinking (30 seconds)
*Step back. Look at the room.*

"We built this in a single hackathon weekend. It's not a mockup — it's a working app with a real backend, a real database, real login and real QR check-in."

"Now imagine this with the full MDX timetable synced in, push notifications before your next lecture, and rolled out across every campus — London, Dubai, Malta, Mauritius."

"MyCampus is the campus app MDX students actually need. We're ready to pilot it. Let's make it happen."

---

## 📋 IMPORTANT POINTS TO HIT — QUICK LIST
*Tick these off mentally as you go through the demo.*

- [ ] Open with a relatable problem — wrong building, full room
- [ ] Show the dashboard map FIRST — it's the wow moment
- [ ] Say "this is our actual campus, not a generic map"
- [ ] Explain the colour system in plain English (green = fine, red = avoid)
- [ ] Point out Ravensfield square purple = housing, round = academic — no confusion
- [ ] Show the building detail panel sliding in — looks polished
- [ ] Demonstrate seat booking — tap empty seat, modal, confirm, green tick
- [ ] Show ClassPulse headcount ring — "you know before you arrive"
- [ ] Say "one QR scan, you're marked present" — replace paper registers
- [ ] Mention privacy controls — "nobody sees you unless you allow it"
- [ ] Hit the panic button topic — don't skip it, judges love the safety angle
- [ ] End with "built in one weekend — imagine with a full team"
- [ ] Mention scalability: other MDX campuses, then other universities

---

## ❓ Questions You'll Probably Get — Plain English Answers

**"Can't students just fake check-in for each other?"**
> The QR code is unique to each class session and changes. In the future we add Bluetooth proximity — your phone has to physically be in the room. For now it's the same as any university system but faster.

**"What if I don't want people to know where I am?"**
> Set it to Anonymous. Done. Nobody sees you, not even the app dashboard. Your location is never stored for more than 24 hours anyway.

**"How is this different from just texting your mates?"**
> It's structured and campus-specific. You don't need to ask "are you in yet?" — you open the app and see 12 people already there. And you don't have to share your personal number with 200 classmates.

**"What about lecturers — do they benefit?"**
> Yes. They'd see live attendance on their end. No more counting hands. Instant data on who showed up. That's the lecturer dashboard feature on the roadmap.

**"Is this just for MDX?"**
> Right now yes, it's built around Hendon campus. But the whole system is designed to be white-labelled — any university gets their own branded version. That's the commercial opportunity.

**"How do you make money from this?"**
> University pays a licence fee — roughly £5–15k a year per campus. For MDX with 4 global campuses that's £20–60k a year from one client. Scale to 20 universities and it's a proper SaaS business.

---

## 📈 Scalability — Say It Simply

Don't say "microservices" or "Kubernetes" to a non-technical audience. Instead say:

> "Right now we're running a demo database — think of it like a test environment. To go live with the whole of MDX, we switch to a proper database setup that can handle tens of thousands of students at once. The code is already written for it — it's just a config change. To go global, we add caching layers and scale horizontally. The architecture was designed with this in mind from day one."

**The honest scaling roadmap:**
1. **Today** — Demo running, supports ~100 users
2. **Pilot (1 month)** — Swap SQLite → PostgreSQL, handle full MDX Hendon (4,000 students)
3. **Full MDX** — All campuses, Moodle timetable sync, push notifications (~20,000 students)
4. **Commercial** — Multi-tenant, other universities, white-label branding

---

## 🏆 Why We Win

| What we built | Why it matters |
|---------------|----------------|
| Live occupancy map | Students stop wasting time walking to full rooms |
| QR check-in | Lecturers get instant attendance without paper |
| Seat booking | Students know where they're sitting before they arrive |
| Dashboard timetable map | One screen tells you everything about your day |
| Privacy controls | Students actually trust it and use it |
| Panic button | University takes student safety seriously |
| Ritterman vs Ravensfield markers | Tiny detail that shows we thought about real student pain |

---

## 🔑 Demo Login Credentials

| Email | Password | Who |
|-------|----------|-----|
| `ak1234@live.mdx.ac.uk` | `demo123` | Alex Kumar (you) |
| `sj5678@live.mdx.ac.uk` | `demo123` | Sarah Johnson |

---

*Navigate. Connect. Stay Safe.*
*Built at Middlesex University Hackathon 2026*

