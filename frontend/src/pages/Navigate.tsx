import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { BUILDINGS, ROOM_CAPACITIES } from "@/lib/campusData";
import { findRoute } from "@/lib/pathfinding";
import { useApp } from "@/context/AppContext";
import OccupancyBar from "@/components/OccupancyBar";
import { ArrowRight, Navigation, Shield, AlertTriangle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navigate() {
  const [searchParams] = useSearchParams();
  const { emergency, safeMode, setSafeMode, selectedBuilding, setSelectedBuilding, occupancy, routeResult, setRouteResult } = useApp();

  const [from, setFrom] = useState("ritterman");
  const [to, setTo] = useState(searchParams.get("to") || "");

  const buildingList = Object.values(BUILDINGS);

  useEffect(() => {
    if (searchParams.get("mode") === "safe") setSafeMode(true);
    const dest = searchParams.get("to");
    if (dest) setTo(dest);
  }, [searchParams, setSafeMode]);

  const handleFindRoute = () => {
    if (!from || !to || from === to) return;
    const blocked = emergency.active && emergency.blockedBuilding ? [emergency.blockedBuilding] : [];
    const result = findRoute(from, to, safeMode, blocked);
    setRouteResult(result);
  };

  const fastestResult = useMemo(() => {
    if (!from || !to || from === to) return null;
    const blocked = emergency.active && emergency.blockedBuilding ? [emergency.blockedBuilding] : [];
    return findRoute(from, to, false, blocked);
  }, [from, to, emergency]);

  const safetyDiff = routeResult && fastestResult && safeMode
    ? routeResult.totalTime - fastestResult.totalTime
    : 0;

  const selectedBuildingData = selectedBuilding ? BUILDINGS[selectedBuilding] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col lg:flex-row min-h-[calc(100vh-3.5rem)]"
    >
      {/* Left Panel */}
      <div className="w-full lg:w-[400px] shrink-0 border-r border-border overflow-y-auto p-4 space-y-6">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Plan Your Route</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">From</label>
              <select value={from} onChange={(e) => setFrom(e.target.value)}
                className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground">
                {buildingList.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">To</label>
              <select value={to} onChange={(e) => setTo(e.target.value)}
                className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground">
                <option value="">Select destination</option>
                {buildingList.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-foreground">Safety Mode</span>
              <button onClick={() => setSafeMode(!safeMode)}
                className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  safeMode ? "bg-accent" : "bg-primary")}>
                <span className={cn("inline-block h-4 w-4 rounded-full bg-white transition-transform",
                  safeMode ? "translate-x-6" : "translate-x-1")} />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              {safeMode ? "🛡 Safest Route — avoids unlit paths" : "⚡ Fastest Route"}
            </p>
            <button onClick={handleFindRoute} disabled={!from || !to || from === to}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-40 hover:bg-primary/90 transition-colors">
              <Navigation className="w-4 h-4" /> Find Route
            </button>
          </div>

          {routeResult && (
            <div className="mt-4 p-3 rounded-lg bg-muted space-y-2">
              <p className="font-display text-sm font-bold text-foreground">{routeResult.totalTime} min walk</p>
              <div className="flex items-center flex-wrap gap-1">
                {routeResult.path.map((id, i) => (
                  <span key={id} className="flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded bg-card text-xs font-medium text-foreground border border-border">
                      {BUILDINGS[id]?.name || id}
                    </span>
                    {i < routeResult.path.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
                  </span>
                ))}
              </div>
              {safeMode && safetyDiff > 0 && (
                <p className="text-xs text-accent flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Safety mode added {safetyDiff} min to avoid unlit paths
                </p>
              )}
            </div>
          )}
        </div>

        {emergency.active && (
          <div className="p-3 rounded-lg border border-destructive/40 bg-destructive/10 space-y-2">
            <div className="flex items-center gap-2 text-destructive text-sm font-semibold">
              <AlertTriangle className="w-4 h-4" /> Emergency Mode Active
            </div>
            {emergency.blockedBuilding && (
              <p className="text-xs text-muted-foreground">
                {BUILDINGS[emergency.blockedBuilding]?.name} is blocked.
              </p>
            )}
          </div>
        )}

        {selectedBuildingData && (
          <div className="space-y-3">
            <h3 className="font-display text-sm font-bold text-foreground">{selectedBuildingData.name}</h3>
            <p className="text-xs text-muted-foreground">{selectedBuildingData.description}</p>
            {selectedBuildingData.rooms.length > 0 && (
              <div className="space-y-2">
                {selectedBuildingData.rooms.map((room) => {
                  const occ = occupancy[room];
                  if (!occ) return null;
                  return (
                    <div key={room} className="p-2 rounded bg-muted">
                      <p className="text-xs font-medium text-foreground mb-1">{room}: {ROOM_CAPACITIES[room]?.buildingName}</p>
                      <OccupancyBar count={occ.count} capacity={occ.capacity} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Campus Map with Image */}
      <div className="flex-1 relative bg-secondary/50 flex items-center justify-center p-4 overflow-hidden">
        <div className="relative w-full max-w-4xl">
          <img 
            src="/campus-map.png" 
            alt="Middlesex University Hendon Campus" 
            className="w-full h-auto rounded-lg shadow-lg"
          />
          
          {/* SVG Overlay for markers and routes */}
          <svg 
            viewBox="0 0 1024 683" 
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ pointerEvents: 'none' }}
          >
            {/* Route line */}
            {routeResult && routeResult.path.length > 1 && (
              <polyline
                points={routeResult.path.map((id) => `${BUILDINGS[id]?.mapX || 0},${BUILDINGS[id]?.mapY || 0}`).join(" ")}
                fill="none"
                stroke={safeMode ? "#22c55e" : "#3b82f6"}
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="12,8"
                className="drop-shadow-lg"
              />
            )}
          </svg>

          {/* Building markers as positioned buttons */}
          {buildingList.map((b) => {
            const isBlocked = emergency.active && emergency.blockedBuilding === b.id;
            const isSelected = selectedBuilding === b.id;
            const isOnRoute = routeResult?.path.includes(b.id);
            const isStart = routeResult?.path[0] === b.id;
            const isEnd = routeResult?.path[routeResult.path.length - 1] === b.id;
            
            return (
              <button
                key={b.id}
                onClick={() => setSelectedBuilding(b.id)}
                className={cn(
                  "absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 transition-all z-10",
                  isSelected && "scale-110"
                )}
                style={{
                  left: `${(b.mapX / 1024) * 100}%`,
                  top: `${(b.mapY / 683) * 100}%`,
                }}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-lg border-2 transition-all",
                  isBlocked ? "bg-red-500 border-red-600 text-white" :
                  isStart ? "bg-green-500 border-green-600 text-white" :
                  isEnd ? "bg-blue-500 border-blue-600 text-white" :
                  isOnRoute ? "bg-primary border-primary text-white" :
                  isSelected ? "bg-primary border-primary text-white" :
                  "bg-white border-gray-300 text-gray-800 hover:border-primary"
                )}>
                  {isStart ? "A" : isEnd ? "B" : b.code}
                </div>
                <span className={cn(
                  "text-[10px] font-semibold px-1 py-0.5 rounded bg-white/90 shadow-sm whitespace-nowrap",
                  isSelected ? "text-primary" : "text-gray-700"
                )}>
                  {b.name.replace(" Building", "")}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
