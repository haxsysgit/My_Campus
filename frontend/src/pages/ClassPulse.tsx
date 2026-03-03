import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Users, Clock, MapPin, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface ClassInfo {
  id: string;
  code: string;
  name: string;
  room: string;
  building_name?: string;
  start_time: string;
  end_time: string;
  headcount: { checked_in: number; total: number };
}

function getClassStatus(startTime: string, endTime: string): "past" | "current" | "future" {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  const start = sh * 60 + sm;
  const end = eh * 60 + em;
  if (nowMin >= end) return "past";
  if (nowMin >= start) return "current";
  return "future";
}

export default function ClassPulse() {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClasses() {
      try {
        const data = await api.getTodaysClasses();
        setClasses(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchClasses();
  }, []);

  const totalCheckedIn = classes.reduce((sum, c) => sum + c.headcount.checked_in, 0);

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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-destructive">{error}</div>
        ) : classes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No classes scheduled for today.
          </div>
        ) : (
          <div className="space-y-3">
            {classes.map((cls) => {
              const status = getClassStatus(cls.start_time, cls.end_time);
              return (
                <Link key={cls.id} to={`/classpulse/${cls.id}`}>
                  <Card className={`p-4 flex items-center gap-4 transition-colors hover:bg-muted/50 ${
                    status === "current" ? "border-primary bg-primary/5" : 
                    status === "past" ? "opacity-60" : ""
                  }`}>
                    <div className="flex flex-col items-center min-w-[60px]">
                      <span className={`text-lg font-semibold ${status === "current" ? "text-primary" : "text-muted-foreground"}`}>
                        {cls.start_time}
                      </span>
                      <span className="text-xs text-muted-foreground">{cls.end_time}</span>
                    </div>
                    <div className={`w-1 h-12 rounded-full ${status === "current" ? "bg-primary" : status === "past" ? "bg-accent" : "bg-muted"}`} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{cls.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {cls.room}
                      </p>
                      <p className="text-xs text-accent mt-1">
                        {cls.headcount.checked_in}/{cls.headcount.total} checked in
                      </p>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
