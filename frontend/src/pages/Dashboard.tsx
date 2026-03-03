import { Link } from "react-router-dom";
import { MapPin, Users, Shield, ArrowRight, BookOpen } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { DEMO_TIMETABLE, BUILDINGS } from "@/lib/campusData";
import { motion } from "framer-motion";
import DashboardMap from "@/components/DashboardMap";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getNextClass() {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return DEMO_TIMETABLE.find((c) => {
    const [h, m] = c.time.split(":").map(Number);
    return h * 60 + m + c.duration > nowMinutes;
  });
}

export default function Dashboard() {
  const { currentUser, occupancy, emergency } = useApp();
  const nextClass = getNextClass();
  const totalCheckedIn = Object.values(occupancy).reduce((s, r) => s + r.count, 0);

  const cards = [
    {
      icon: MapPin,
      title: "Campus Navigator",
      desc: "Plan your route. Fastest or safest path between any two buildings.",
      stat: "8 buildings mapped",
      cta: "Open Map",
      link: "/navigate",
      accent: "primary",
    },
    {
      icon: Users,
      title: "ClassPulse",
      desc: "Check in to class. See who's already there. Live headcount.",
      stat: `${totalCheckedIn} students checked in`,
      cta: "View Classes",
      link: "/classpulse",
      accent: "accent",
    },
    {
      icon: Shield,
      title: "Campus Safety",
      desc: "Safe route planner. Emergency alerts. Panic button.",
      stat: emergency.active ? "⚠ Emergency active" : "All clear · Campus normal",
      cta: "Safety Map",
      link: "/navigate?mode=safe",
      accent: "warning",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[calc(100vh-3.5rem)]"
    >
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 py-12 relative">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            {getGreeting()}, {currentUser.name}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Middlesex University · Hendon Campus · 3 March 2026
          </p>

          {nextClass ? (
            <Link
              to={`/navigate?to=${nextClass.building}`}
              className="mt-6 inline-flex items-center gap-4 px-5 py-3 rounded-lg bg-card border border-border hover:border-foreground/20 transition-all group"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-accent/10">
                <BookOpen className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Next class</p>
                <p className="font-display text-sm font-bold text-foreground">
                  {nextClass.module} · {nextClass.room} · {nextClass.time}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors ml-2" />
            </Link>
          ) : (
            <div className="mt-6 inline-flex items-center gap-3 px-5 py-3 rounded-lg bg-card border border-border">
              <p className="text-sm text-muted-foreground">No more classes today</p>
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Map — today's schedule + live campus */}
      <div className="container mx-auto px-4 pt-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <DashboardMap />
        </motion.div>
      </div>

      {/* Feature Cards */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 1) }}
            >
              <Link
                to={card.link}
                className="block p-6 rounded-lg border bg-card hover:-translate-y-0.5 hover:border-foreground/20 transition-all h-full"
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-md bg-${card.accent}/10 mb-4`}>
                  <card.icon className={`w-5 h-5 text-${card.accent}`} />
                </div>
                <h2 className="font-display text-lg font-bold text-foreground">{card.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{card.desc}</p>
                <p className="mt-3 text-xs font-medium text-muted-foreground">{card.stat}</p>
                <div className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold text-${card.accent}`}>
                  {card.cta} <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}
