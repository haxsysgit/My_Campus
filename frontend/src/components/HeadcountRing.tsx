import { cn } from "@/lib/utils";

interface HeadcountRingProps {
  count: number;
  total: number;
  size?: number;
  className?: string;
}

export default function HeadcountRing({ count, total, size = 160, className }: HeadcountRingProps) {
  const pct = Math.min((count / total) * 100, 100);
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const strokeColor = pct < 70 ? "hsl(var(--accent))" : pct < 90 ? "hsl(var(--warning))" : "hsl(var(--destructive))";

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={8}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-4xl font-bold text-foreground">{count}</span>
        <span className="text-xs text-muted-foreground">/ {total} enrolled</span>
      </div>
    </div>
  );
}
