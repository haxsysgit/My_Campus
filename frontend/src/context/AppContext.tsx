import React, { createContext, useContext, useState, useCallback } from "react";
import { RouteResult } from "@/lib/pathfinding";
import { ROOM_CAPACITIES } from "@/lib/campusData";

interface EmergencyState {
  active: boolean;
  blockedBuilding: string | null;
  triggeredAt: Date | null;
}

interface CurrentUser {
  id: string;
  name: string;
  email?: string;
  studentId?: string;
  courses?: string[];
}

interface RoomOccupancy {
  count: number;
  capacity: number;
}

interface AppContextType {
  emergency: EmergencyState;
  currentUser: CurrentUser | null;
  routeResult: RouteResult | null;
  selectedBuilding: string | null;
  safeMode: boolean;
  occupancy: Record<string, RoomOccupancy>;
  triggerEmergency: (buildingId: string) => void;
  clearEmergency: () => void;
  setRouteResult: (result: RouteResult | null) => void;
  setSafeMode: (value: boolean) => void;
  setSelectedBuilding: (id: string | null) => void;
  checkIn: (roomCode: string) => void;
  setCurrentUser: (user: CurrentUser | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [emergency, setEmergency] = useState<EmergencyState>({
    active: false,
    blockedBuilding: null,
    triggeredAt: null,
  });

  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [safeMode, setSafeMode] = useState(false);
  const [currentUser, setCurrentUserState] = useState<CurrentUser | null>(null);

  // Initialize occupancy from ROOM_CAPACITIES with mock counts
  const [occupancy, setOccupancy] = useState<Record<string, RoomOccupancy>>(() => {
    const initial: Record<string, RoomOccupancy> = {};
    Object.entries(ROOM_CAPACITIES).forEach(([code, info]) => {
      initial[code] = { count: Math.floor(Math.random() * 10) + 2, capacity: info.capacity };
    });
    return initial;
  });

  const setCurrentUser = useCallback((user: CurrentUser | null) => {
    setCurrentUserState(user);
  }, []);

  const logout = useCallback(() => {
    setCurrentUserState(null);
    localStorage.removeItem('token');
  }, []);

  const isAuthenticated = !!currentUser;

  const triggerEmergency = useCallback((buildingId: string) => {
    setEmergency({ active: true, blockedBuilding: buildingId, triggeredAt: new Date() });
  }, []);

  const clearEmergency = useCallback(() => {
    setEmergency({ active: false, blockedBuilding: null, triggeredAt: null });
  }, []);

  const checkIn = useCallback((roomCode: string) => {
    setOccupancy((prev) => {
      const room = prev[roomCode];
      if (!room) return prev;
      return { ...prev, [roomCode]: { ...room, count: room.count + 1 } };
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        emergency,
        currentUser,
        routeResult,
        selectedBuilding,
        safeMode,
        occupancy,
        triggerEmergency,
        clearEmergency,
        setRouteResult,
        setSafeMode,
        setSelectedBuilding,
        checkIn,
        setCurrentUser,
        isAuthenticated,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
