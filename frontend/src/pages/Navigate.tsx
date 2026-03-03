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

  // SVG map coordinates (normalized from real lat/lng)
  const mapBounds = {
    minLat: 51.58700, maxLat: 51.58910,
    minLng: -0.23060, maxLng: -0.22780,
  };
  const toSvg = (lat: number, lng: number): [number, number] => {
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 500;
    const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 400;
    return [x, y];
  };

  const routePath = routeResult
    ? routeResult.path.map((id) => toSvg(BUILDINGS[id].lat, BUILDINGS[id].lng))
    : [];

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

      {/* SVG Campus Map */}
      <div className="flex-1 relative bg-secondary/50 flex items-center justify-center p-4">
        <svg viewBox="0 0 500 400" className="w-full max-w-2xl h-auto">
          {/* Grid lines */}
          {[0, 100, 200, 300, 400, 500].map((x) => (
            <line key={`gx${x}`} x1={x} y1={0} x2={x} y2={400} stroke="hsl(var(--border))" strokeWidth={0.5} opacity={0.3} />
          ))}
          {[0, 100, 200, 300, 400].map((y) => (
            <line key={`gy${y}`} x1={0} y1={y} x2={500} y2={y} stroke="hsl(var(--border))" strokeWidth={0.5} opacity={0.3} />
          ))}

          {/* Route line */}
          {routePath.length > 1 && (
            <polyline
              points={routePath.map(([x, y]) => `${x},${y}`).join(" ")}
              fill="none"
              stroke={safeMode ? "hsl(var(--accent))" : "hsl(var(--primary))"}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="8,4"
            />
          )}

          {/* Building markers */}
          {buildingList.map((b) => {
            const [x, y] = toSvg(b.lat, b.lng);
            const isBlocked = emergency.active && emergency.blockedBuilding === b.id;
            const isSelected = selectedBuilding === b.id;
            const isOnRoute = routeResult?.path.includes(b.id);
            return (
              <g key={b.id} onClick={() => setSelectedBuilding(b.id)} className="cursor-pointer">
                <circle
                  cx={x} cy={y} r={isSelected ? 22 : 18}
                  fill={isBlocked ? "hsl(var(--destructive))" : isSelected ? "hsl(var(--primary))" : "hsl(var(--card))"}
                  stroke={isBlocked ? "hsl(var(--destructive))" : isOnRoute ? "hsl(var(--primary))" : "hsl(var(--border))"}
                  strokeWidth={2}
                  className="transition-all duration-200"
                />
                <text
                  x={x} y={y + 1}
                  textAnchor="middle" dominantBaseline="central"
                  fill="hsl(var(--foreground))"
                  fontSize={b.code.length > 2 ? 7 : 10}
                  fontFamily="'Space Mono', monospace"
                  fontWeight={700}
                >
                  {b.code}
                </text>
                <text
                  x={x} y={y + 30}
                  textAnchor="middle"
                  fill="hsl(var(--muted-foreground))"
                  fontSize={8}
                  fontFamily="'DM Sans', sans-serif"
                >
                  {b.name.replace(" Building", "")}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </motion.div>
  );
}
