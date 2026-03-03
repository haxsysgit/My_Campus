import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import { TimetableEntry, BUILDINGS } from "@/lib/campusData";
import { useApp } from "@/context/AppContext";
import OccupancyBar from "./OccupancyBar";
import { cn } from "@/lib/utils";

interface ClassCardProps {
  entry: TimetableEntry;
  status: "past" | "current" | "future";
}

export default function ClassCard({ entry, status }: ClassCardProps) {
  const { occupancy } = useApp();
  const room = occupancy[entry.room] || { count: 0, capacity: entry.enrolled };
  const building = BUILDINGS[entry.building];
  const endMinutes =
    parseInt(entry.time.split(":")[0]) * 60 +
    parseInt(entry.time.split(":")[1]) +
    entry.duration;
  const endHour = Math.floor(endMinutes / 60).toString().padStart(2, "0");
  const endMin = (endMinutes % 60).toString().padStart(2, "0");

  const stripeColor =
    status === "past" ? "bg-primary" : status === "current" ? "bg-accent" : "bg-muted-foreground/30";

  return (
    <div
      className={cn(
        "relative flex overflow-hidden rounded-lg border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/20",
        status === "current" && "ring-1 ring-accent/30"
      )}
    >
      <div className={cn("w-1.5 shrink-0", stripeColor)} />
      <div className="flex-1 p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-sm font-bold text-foreground">{entry.module}</h3>
            <p className="text-xs text-muted-foreground">{entry.code}</p>
          </div>
          {status === "current" && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-accent">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent animate-live-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Now
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>
            {entry.time} – {endHour}:{endMin}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {entry.room} · {building?.name || entry.building}
          </span>
        </div>

        <OccupancyBar count={room.count} capacity={entry.enrolled} />

        <div className="flex gap-2">
          <Link
            to={`/navigate?to=${entry.building}`}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            Navigate <ArrowRight className="w-3 h-3" />
          </Link>
          <Link
            to={`/classpulse/${entry.room}`}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
          >
            Check In <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
