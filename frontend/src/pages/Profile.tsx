import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { User, Mail, Shield, Eye, Bell, LogOut, ChevronRight, IdCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

const VISIBILITY_LABELS = {
  1: "Anonymous",
  2: "Class Visible",
  3: "Friends Visible",
};

export default function Profile() {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <p className="text-muted-foreground">Not logged in</p>
      </div>
    );
  }

  const menuItems = [
    {
      icon: Eye,
      label: "Privacy Settings",
      desc: `Visibility: ${VISIBILITY_LABELS[currentUser.visibility_level as keyof typeof VISIBILITY_LABELS] || "Class Visible"}`,
      action: () => {},
    },
    {
      icon: Bell,
      label: "Notifications",
      desc: "Push notifications enabled",
      action: () => {},
    },
    {
      icon: Shield,
      label: "Safety Preferences",
      desc: "Safe route mode, emergency contacts",
      action: () => {},
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[calc(100vh-3.5rem)]"
    >
      <div className="container mx-auto max-w-lg px-4 py-8 space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-3xl font-bold text-primary">
              {currentUser.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "U"}
            </span>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {currentUser.name}
            </h1>
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
              <Mail className="w-3.5 h-3.5" />
              {currentUser.email}
            </p>
            {currentUser.studentId && (
              <p className="text-sm text-primary font-medium flex items-center justify-center gap-1 mt-1">
                <IdCard className="w-3.5 h-3.5" />
                {currentUser.studentId}
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">12</p>
            <p className="text-xs text-muted-foreground">Classes</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-accent">94%</p>
            <p className="text-xs text-muted-foreground">Attendance</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">5</p>
            <p className="text-xs text-muted-foreground">Friends</p>
          </Card>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:bg-muted/50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <item.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground">
          MyCampus v1.0 · Middlesex University
        </p>
      </div>
    </motion.div>
  );
}
