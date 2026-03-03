import { Link, useLocation, useNavigate } from "react-router-dom";
import { MapPin, Users, Shield, AlertTriangle, Clock, User } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { emergency, isAuthenticated, currentUser, logout } = useApp();
  const location = useLocation();

  // Hide navbar on login page
  if (location.pathname === "/login") return null;
  if (!isAuthenticated) return null;
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { path: "/", label: "Dashboard", icon: Shield },
    { path: "/navigate", label: "Navigate", icon: MapPin },
    { path: "/classpulse", label: "ClassPulse", icon: Users },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        emergency.active
          ? "bg-destructive/20 border-destructive/40"
          : "bg-secondary border-border"
      )}
    >
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center font-display text-sm font-bold text-primary-foreground">
            MC
          </div>
          <span className="font-display text-sm font-bold text-foreground hidden sm:block">
            MyCampus
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground font-display">
            <Clock className="w-3.5 h-3.5" />
            {time.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>

          <button
            onClick={() => navigate("/emergency")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold transition-all",
              emergency.active
                ? "bg-destructive text-destructive-foreground animate-emergency-pulse"
                : "bg-destructive/10 text-destructive hover:bg-destructive/20"
            )}
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden sm:inline">Emergency</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
