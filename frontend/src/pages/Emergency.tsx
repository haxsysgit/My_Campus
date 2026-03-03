import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Phone, X, Loader2 } from "lucide-react";
import { BUILDINGS } from "@/lib/campusData";
import { useApp } from "@/context/AppContext";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Emergency() {
  const { emergency, triggerEmergency, clearEmergency } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [alertSent, setAlertSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSendAlert = async () => {
    if (!selectedBuilding || sending) return;
    setSending(true);
    try {
      const building = BUILDINGS[selectedBuilding];
      await api.sendEmergencyAlert(building?.lat || 51.5899, building?.lng || -0.2284, `Emergency at ${building?.name}`);
      triggerEmergency(selectedBuilding);
      setAlertSent(true);
      toast({ title: "Alert sent", description: "Security has been notified" });
      setTimeout(() => navigate("/navigate"), 3000);
    } catch (err: any) {
      toast({ title: "Failed to send alert", description: err.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const handleClear = () => {
    clearEmergency();
    setAlertSent(false);
    setSelectedBuilding(null);
    navigate("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[calc(100vh-3.5rem)] bg-destructive/5"
    >
      <div className="container mx-auto max-w-lg px-4 py-12 space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center">
            <ShieldAlert className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Campus Emergency</h1>
        </div>

        <AnimatePresence mode="wait">
          {alertSent || emergency.active ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center"
            >
              <div className="p-6 rounded-lg border border-destructive/40 bg-destructive/10 space-y-3">
                <p className="text-lg font-semibold text-destructive">🚨 Alert Sent</p>
                <p className="text-sm text-muted-foreground">
                  Security has been notified. Help is on the way.
                </p>
                {emergency.blockedBuilding && (
                  <p className="text-xs text-muted-foreground">
                    {BUILDINGS[emergency.blockedBuilding]?.name} has been blocked from all routes.
                  </p>
                )}
              </div>

              <button
                onClick={handleClear}
                className="px-6 py-2.5 rounded-md border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 inline mr-1" />
                Clear Emergency
              </button>
            </motion.div>
          ) : (
            <motion.div key="form" className="space-y-6">
              {/* Building selector */}
              <div className="space-y-3">
                <p className="text-sm text-foreground font-medium">Which building is affected?</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(BUILDINGS).map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBuilding(b.id)}
                      className={cn(
                        "px-3 py-2 rounded-md border text-sm font-medium transition-all text-left",
                        selectedBuilding === b.id
                          ? "border-destructive bg-destructive/10 text-destructive"
                          : "border-border bg-card text-foreground hover:border-foreground/20"
                      )}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSendAlert}
                disabled={!selectedBuilding || sending}
                className="w-full py-4 rounded-md bg-destructive text-destructive-foreground font-bold text-lg disabled:opacity-40 hover:bg-destructive/90 transition-colors animate-emergency-pulse"
              >
                {sending ? <Loader2 className="w-5 h-5 animate-spin inline mr-2" /> : "🚨 "}
                {sending ? "SENDING..." : "SEND ALERT"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Emergency contacts */}
        <div className="space-y-3 pt-4 border-t border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Emergency Contacts</p>
          {[
            { label: "Campus Security", number: "020 8411 5555" },
            { label: "Metropolitan Police", number: "999" },
            { label: "Campus Medical", number: "020 8411 5556" },
          ].map((contact) => (
            <div key={contact.label} className="flex items-center justify-between py-2">
              <span className="text-sm text-foreground">{contact.label}</span>
              <a
                href={`tel:${contact.number.replace(/\s/g, "")}`}
                className="flex items-center gap-1.5 text-sm text-primary font-medium"
              >
                <Phone className="w-3.5 h-3.5" />
                {contact.number}
              </a>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
