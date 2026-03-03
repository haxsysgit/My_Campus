import { cn } from "@/lib/utils";
import { AlertTriangle, AlertCircle, CheckCircle, Users } from "lucide-react";

interface OccupancyBarProps {
  count: number;
  capacity: number;
  className?: string;
  showLabel?: boolean;
  compact?: boolean;
}

export type OccupancyStatus = "empty" | "available" | "filling" | "busy" | "overcrowded";

export function getOccupancyStatus(pct: number): OccupancyStatus {
  if (pct === 0) return "empty";
  if (pct < 40) return "available";
  if (pct < 65) return "filling";
  if (pct < 85) return "busy";
  return "overcrowded";
}

export const OCCUPANCY_CONFIG: Record<OccupancyStatus, {
  label: string;
  color: string;
  barColor: string;
  bg: string;
  icon: typeof CheckCircle;
}> = {
  empty:       { label: "Empty",           color: "text-muted-foreground", barColor: "bg-muted-foreground/40", bg: "bg-muted/30",          icon: Users },
  available:   { label: "Available",        color: "text-emerald-600",      barColor: "bg-emerald-500",         bg: "bg-emerald-50",        icon: CheckCircle },
  filling:     { label: "Filling Up",       color: "text-yellow-600",       barColor: "bg-yellow-400",          bg: "bg-yellow-50",         icon: AlertCircle },
  busy:        { label: "Mildly Crowded",   color: "text-orange-500",       barColor: "bg-orange-400",          bg: "bg-orange-50",         icon: AlertTriangle },
  overcrowded: { label: "Overcrowded",      color: "text-red-600",          barColor: "bg-red-500",             bg: "bg-red-50",            icon: AlertTriangle },
};

export default function OccupancyBar({ count, capacity, className, showLabel = true, compact = false }: OccupancyBarProps) {
  const pct = capacity > 0 ? Math.min((count / capacity) * 100, 100) : 0;
  const status = getOccupancyStatus(pct);
  const cfg = OCCUPANCY_CONFIG[status];
  const Icon = cfg.icon;

  if (compact) {
    return (
      <div className={cn("flex items-center gap-1.5", className)}>
        <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
          <div className={cn("h-full rounded-full transition-all duration-500", cfg.barColor)} style={{ width: `${pct}%` }} />
        </div>
        <span className={cn("text-[10px] font-semibold shrink-0", cfg.color)}>{cfg.label}</span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      {showLabel && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Icon className={cn("w-3 h-3", cfg.color)} />
            <span className={cn("text-xs font-semibold", cfg.color)}>{cfg.label}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {count} / {capacity} <span className="hidden sm:inline">seats</span>
          </span>
        </div>
      )}
      <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", cfg.barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>0</span>
          <span className="font-medium">{Math.round(pct)}% full</span>
          <span>{capacity}</span>
        </div>
      )}
    </div>
  );
}
