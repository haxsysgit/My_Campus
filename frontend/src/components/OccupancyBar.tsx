import { cn } from "@/lib/utils";

interface OccupancyBarProps {
  count: number;
  capacity: number;
  className?: string;
  showLabel?: boolean;
}

export default function OccupancyBar({ count, capacity, className, showLabel = true }: OccupancyBarProps) {
  const pct = Math.min((count / capacity) * 100, 100);
  const color = pct < 50 ? "bg-accent" : pct < 80 ? "bg-warning" : "bg-destructive";

  return (
    <div className={cn("space-y-1", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{count} / {capacity} students</span>
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
