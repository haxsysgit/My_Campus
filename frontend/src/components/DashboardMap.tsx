import { Link } from "react-router-dom";
import { MapPin, Clock, BookOpen, ArrowRight } from "lucide-react";
import { BUILDINGS, DEMO_TIMETABLE } from "@/lib/campusData";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

function getOccupancyColor(pct: number) {
  if (pct >= 85) return "bg-red-500 border-red-700";
  if (pct >= 65) return "bg-orange-400 border-orange-600";
  if (pct >= 40) return "bg-yellow-400 border-yellow-600";
  if (pct > 0)   return "bg-emerald-500 border-emerald-700";
  return "bg-white border-gray-300";
}

function getNowMinutes() {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes();
}

export default function DashboardMap() {
  const { occupancy } = useApp();
  const nowMins = getNowMinutes();

  // Today's classes sorted by time
  const todayClasses = DEMO_TIMETABLE.map((c) => {
    const [h, m] = c.time.split(":").map(Number);
    const startMin = h * 60 + m;
    const endMin = startMin + c.duration;
    const isPast = endMin < nowMins;
    const isNow  = startMin <= nowMins && nowMins < endMin;
    const isNext = !isPast && !isNow && startMin > nowMins;
    return { ...c, startMin, endMin, isPast, isNow, isNext };
  });

  const nextClass = todayClasses.find((c) => c.isNow || c.isNext);
  const nextBuilding = nextClass ? BUILDINGS[nextClass.building as keyof typeof BUILDINGS] : null;

  const buildings = Object.values(BUILDINGS);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="font-display font-bold text-foreground flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-primary" />
          Your Day at a Glance
        </h2>
        <Link
          to="/navigate"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          Full Map <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row">
        {/* Mini Campus Map */}
        <div className="relative flex-shrink-0 sm:w-64 h-44 sm:h-auto bg-muted overflow-hidden">
          <img
            src="/campus-map.png"
            alt="Campus map"
            className="w-full h-full object-cover object-center"
            style={{ minHeight: "176px" }}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/10" />

          {buildings.map((b) => {
            const isNext = nextBuilding?.id === b.id;
            const roomPcts = b.rooms.map((r) => {
              const o = occupancy[r];
              return o ? (o.count / o.capacity) * 100 : 0;
            });
            const worstPct = roomPcts.length ? Math.max(...roomPcts) : 0;
            const colorClass = getOccupancyColor(worstPct);

            return (
              <div
                key={b.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${(b.mapX / 1024) * 100}%`,
                  top:  `${(b.mapY / 683) * 100}%`,
                }}
              >
                {isNext && (
                  <span className="absolute inset-0 rounded-full animate-ping bg-primary/60 scale-150" />
                )}
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center text-[7px] font-bold text-white shadow-md z-10 relative",
                  isNext ? "bg-primary border-primary w-7 h-7 ring-2 ring-white ring-offset-1" : colorClass
                )}>
                  {b.code}
                </div>
              </div>
            );
          })}

          {/* "You are here" label */}
          {nextBuilding && (
            <div className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
              ▶ Next: {nextBuilding.name.replace(" Building", "")}
            </div>
          )}
        </div>

        {/* Timetable */}
        <div className="flex-1 divide-y divide-border">
          {todayClasses.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No classes today</p>
          ) : (
            todayClasses.map((c) => (
              <Link
                key={c.code + c.time}
                to={`/class/${c.room}`}
                className={cn(
                  "flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors group",
                  c.isPast && "opacity-40"
                )}
              >
                {/* Time column */}
                <div className="flex flex-col items-center min-w-[3rem]">
                  <span className={cn(
                    "text-xs font-bold",
                    c.isNow ? "text-primary" : "text-foreground"
                  )}>
                    {c.time}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {c.duration}min
                  </span>
                </div>

                {/* Status bar */}
                <div className={cn(
                  "w-1 self-stretch rounded-full flex-shrink-0 mt-0.5",
                  c.isNow  ? "bg-primary" :
                  c.isNext ? "bg-yellow-400" :
                  "bg-muted"
                )} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{c.module}</p>
                  <p className="text-[10px] text-muted-foreground">{c.room} · {BUILDINGS[c.building as keyof typeof BUILDINGS]?.name.replace(" Building","") ?? c.building}</p>
                  {c.isNow && (
                    <span className="inline-block mt-0.5 text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                      In progress
                    </span>
                  )}
                  {c.isNext && !c.isNow && (
                    <span className="inline-block mt-0.5 text-[9px] font-bold bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">
                      Up next
                    </span>
                  )}
                </div>

                {/* Nav shortcut */}
                <Link
                  to={`/navigate?to=${c.building}`}
                  onClick={(e) => e.stopPropagation()}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-primary/10"
                  title="Navigate there"
                >
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                </Link>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Map legend */}
      <div className="px-4 py-2 border-t border-border flex items-center gap-4 text-[10px] text-muted-foreground bg-muted/30">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />Next class</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />Available</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />Filling</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />Overcrowded</span>
      </div>
    </div>
  );
}
