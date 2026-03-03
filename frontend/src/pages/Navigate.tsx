import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BUILDINGS, ROOM_CAPACITIES } from "@/lib/campusData";
import { findRoute } from "@/lib/pathfinding";
import { useApp } from "@/context/AppContext";
import OccupancyBar, { getOccupancyStatus, OCCUPANCY_CONFIG } from "@/components/OccupancyBar";
import { ArrowRight, Navigation, Shield, AlertTriangle, MapPin, X, Clock, Users, Info } from "lucide-react";
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

        <AnimatePresence>
          {selectedBuildingData && (
            <motion.div
              key={selectedBuildingData.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="space-y-3 border border-border rounded-lg p-4 bg-card"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">{selectedBuildingData.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{selectedBuildingData.description}</p>
                </div>
                <button
                  onClick={() => setSelectedBuilding(null)}
                  className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => { setTo(selectedBuildingData.id); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
                >
                  <Navigation className="w-3 h-3" /> Navigate Here
                </button>
                <button
                  onClick={() => { setFrom(selectedBuildingData.id); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md bg-muted text-foreground text-xs font-semibold hover:bg-muted/80 transition-colors"
                >
                  <MapPin className="w-3 h-3" /> Set as Start
                </button>
              </div>

              {/* Rooms with occupancy */}
              {selectedBuildingData.rooms.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Users className="w-3 h-3" /> Room Occupancy
                  </p>
                  {selectedBuildingData.rooms.map((room) => {
                    const occ = occupancy[room];
                    if (!occ) return null;
                    const pct = Math.min((occ.count / occ.capacity) * 100, 100);
                    const status = getOccupancyStatus(pct);
                    const cfg = OCCUPANCY_CONFIG[status];
                    return (
                      <div key={room} className={cn("p-3 rounded-lg border", cfg.bg, "border-transparent")}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold text-foreground">{room}</p>
                          <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full", cfg.bg, cfg.color, "border border-current/20")}>
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mb-2">{ROOM_CAPACITIES[room]?.buildingName}</p>
                        <OccupancyBar count={occ.count} capacity={occ.capacity} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50 text-xs text-muted-foreground">
                  <Info className="w-3 h-3 shrink-0" />
                  No tracked rooms in this building
                </div>
              )}

              {/* Set route from here */}
              <button
                onClick={() => { setFrom(selectedBuildingData.id); setTo(""); setRouteResult(null); }}
                className="w-full text-xs text-muted-foreground hover:text-foreground py-1 transition-colors"
              >
                Use in route planner ↑
              </button>
            </motion.div>
          )}
        </AnimatePresence>
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

            // Compute worst-case occupancy for this building's rooms
            const worstPct = b.rooms.length > 0
              ? Math.max(...b.rooms.map((r) => {
                  const o = occupancy[r];
                  return o ? (o.count / o.capacity) * 100 : 0;
                }))
              : -1;
            const occStatus = worstPct >= 0 ? getOccupancyStatus(worstPct) : null;
            const occCfg = occStatus ? OCCUPANCY_CONFIG[occStatus] : null;

            // Visual identity: accommodation buildings get a square/rounded-sm marker
            const isAccommodation = b.type === "accommodation";
            const isOutdoor = b.type === "outdoor";

            return (
              <button
                key={b.id}
                onClick={() => setSelectedBuilding(isSelected ? null : b.id)}
                className={cn(
                  "absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 transition-all z-10 group",
                  isSelected && "scale-125 z-20"
                )}
                style={{
                  left: `${(b.mapX / 1024) * 100}%`,
                  top: `${(b.mapY / 683) * 100}%`,
                }}
              >
                <div className={cn(
                  "flex items-center justify-center text-xs font-bold shadow-lg border-2 transition-all",
                  // Shape: round for academic, rounded-md for accommodation, diamond-ish for outdoor
                  isAccommodation ? "w-8 h-8 rounded-md" : isOutdoor ? "w-7 h-7 rounded-sm rotate-45" : "w-8 h-8 rounded-full",
                  isBlocked ? "bg-red-500 border-red-700 text-white animate-pulse" :
                  isStart  ? "bg-emerald-500 border-emerald-700 text-white" :
                  isEnd    ? "bg-blue-500 border-blue-700 text-white" :
                  isOnRoute ? "bg-primary border-primary/80 text-white" :
                  isSelected ? "bg-primary border-primary text-white ring-2 ring-primary/30 ring-offset-1" :
                  // Accommodation: purple tones
                  isAccommodation ? "bg-purple-100 border-purple-400 text-purple-800 hover:border-purple-600" :
                  isOutdoor ? "bg-green-100 border-green-400 text-green-800" :
                  occStatus === "overcrowded" ? "bg-red-100 border-red-400 text-red-700" :
                  occStatus === "busy"        ? "bg-orange-100 border-orange-400 text-orange-700" :
                  occStatus === "filling"     ? "bg-yellow-100 border-yellow-400 text-yellow-700" :
                  occStatus === "available"   ? "bg-emerald-100 border-emerald-400 text-emerald-700" :
                  "bg-white border-gray-300 text-gray-800 hover:border-primary hover:scale-110"
                )}>
                  <span className={isOutdoor ? "-rotate-45" : ""}>
                    {isStart ? "A" : isEnd ? "B" : b.code}
                  </span>
                </div>

                {/* Status dot for rooms */}
                {occCfg && !isOnRoute && !isBlocked && (
                  <span className={cn(
                    "absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white",
                    occCfg.barColor
                  )} />
                )}

                {/* Type badge for accommodation */}
                {isAccommodation && !isSelected && (
                  <span className="absolute -top-0.5 -left-0.5 w-3 h-3 rounded-full bg-purple-500 border border-white flex items-center justify-center text-[7px] text-white font-bold">
                    H
                  </span>
                )}

                <span className={cn(
                  "text-[10px] font-semibold px-1 py-0.5 rounded shadow-sm whitespace-nowrap transition-all",
                  isSelected ? "bg-primary text-primary-foreground" :
                  isBlocked  ? "bg-red-100 text-red-700" :
                  isAccommodation ? "bg-purple-50 text-purple-800 border border-purple-200" :
                  "bg-white/95 text-gray-700 group-hover:bg-primary/10 group-hover:text-primary"
                )}>
                  {b.name.replace(" Building", "")}
                </span>

                {/* Tooltip on hover: show type + occupancy */}
                <span className={cn(
                  "absolute -bottom-5 text-[9px] font-bold px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white/95 shadow-sm",
                  isAccommodation ? "text-purple-700" : occCfg ? occCfg.color : "text-muted-foreground"
                )}>
                  {isAccommodation ? "🏠 Accommodation" : occCfg ? occCfg.label : ""}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
