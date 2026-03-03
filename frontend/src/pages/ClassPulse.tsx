import { motion } from "framer-motion";
import { DEMO_TIMETABLE } from "@/lib/campusData";
import { useApp } from "@/context/AppContext";
import ClassCard from "@/components/ClassCard";
import { Users } from "lucide-react";

function getClassStatus(time: string, duration: number): "past" | "current" | "future" {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const [h, m] = time.split(":").map(Number);
  const start = h * 60 + m;
  const end = start + duration;
  if (nowMin >= end) return "past";
  if (nowMin >= start) return "current";
  return "future";
}

export default function ClassPulse() {
  const { occupancy } = useApp();
  const totalCheckedIn = Object.values(occupancy).reduce((s, r) => s + r.count, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[calc(100vh-3.5rem)]"
    >
      <div className="container mx-auto max-w-3xl px-4 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">ClassPulse</h1>
          <p className="text-sm text-muted-foreground mt-1">Today's Classes · 3 March 2026</p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-accent/10 text-accent text-sm font-medium">
            <Users className="w-4 h-4" />
            {totalCheckedIn} students checked in across campus today
          </div>
        </div>

        {/* Class list */}
        <div className="space-y-3">
          {DEMO_TIMETABLE.map((entry) => (
            <ClassCard
              key={entry.code}
              entry={entry}
              status={getClassStatus(entry.time, entry.duration)}
            />
          ))}
        </div>

        {DEMO_TIMETABLE.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No classes scheduled for today.
          </div>
        )}
      </div>
    </motion.div>
  );
}
