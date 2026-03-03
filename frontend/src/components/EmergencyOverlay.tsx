import { useApp } from "@/context/AppContext";
import { AlertTriangle } from "lucide-react";
import { BUILDINGS } from "@/lib/campusData";
import { cn } from "@/lib/utils";

export default function EmergencyOverlay() {
  const { emergency } = useApp();

  if (!emergency.active) return null;

  const building = emergency.blockedBuilding ? BUILDINGS[emergency.blockedBuilding] : null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      <div className="absolute inset-0 border-4 border-destructive animate-border-pulse rounded-lg" />
      <div className="absolute top-16 right-4 pointer-events-auto">
        <div className={cn(
          "flex items-center gap-2 px-4 py-3 rounded-lg bg-destructive/90 text-destructive-foreground shadow-lg backdrop-blur-sm"
        )}>
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div className="text-sm">
            <p className="font-semibold">Campus Emergency Active</p>
            {building && <p className="text-xs opacity-90">{building.name} blocked — routes recalculating</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
