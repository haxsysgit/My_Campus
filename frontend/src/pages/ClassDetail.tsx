import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, QrCode, Camera } from "lucide-react";
import QRCode from "qrcode";
import { DEMO_TIMETABLE, BUILDINGS, ROOM_CAPACITIES } from "@/lib/campusData";
import { useApp } from "@/context/AppContext";
import HeadcountRing from "@/components/HeadcountRing";
import { cn } from "@/lib/utils";

export default function ClassDetail() {
  const { roomId } = useParams<{ roomId: string }>();
  const { occupancy, checkIn } = useApp();
  const [checkedIn, setCheckedIn] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrRef = useRef<any>(null);

  const room = roomId ? occupancy[roomId] : null;
  const roomInfo = roomId ? ROOM_CAPACITIES[roomId] : null;
  const timetableEntry = DEMO_TIMETABLE.find((e) => e.room === roomId);
  const building = timetableEntry ? BUILDINGS[timetableEntry.building] : null;

  // Generate QR code image
  useEffect(() => {
    if (timetableEntry) {
      QRCode.toDataURL(timetableEntry.qrCode, {
        width: 256,
        margin: 2,
        color: { dark: "#F9FAFB", light: "#111827" },
      }).then(setQrDataUrl);
    }
  }, [timetableEntry]);

  const handleCheckIn = useCallback(() => {
    if (!roomId || checkedIn) return;
    checkIn(roomId);
    setCheckedIn(true);
    setScanning(false);
    // Stop scanner if running
    if (html5QrRef.current) {
      html5QrRef.current.stop().catch(() => {});
      html5QrRef.current = null;
    }
  }, [roomId, checkedIn, checkIn]);

  const startScanner = async () => {
    setScanning(true);
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode("qr-reader");
      html5QrRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          if (timetableEntry && decodedText === timetableEntry.qrCode) {
            handleCheckIn();
          }
        },
        () => {}
      );
    } catch {
      // Camera not available — user can use manual check-in
    }
  };

  useEffect(() => {
    return () => {
      if (html5QrRef.current) {
        html5QrRef.current.stop().catch(() => {});
      }
    };
  }, []);

  if (!roomId || !room || !roomInfo) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <p className="text-muted-foreground">Room not found</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[calc(100vh-3.5rem)]"
    >
      <div className="container mx-auto max-w-xl px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            to="/classpulse"
            className="flex items-center justify-center w-8 h-8 rounded-md bg-muted hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">{roomId}</h1>
            <p className="text-sm text-muted-foreground">
              {building?.name} · {roomInfo.buildingName}
            </p>
            {timetableEntry && (
              <p className="text-xs text-muted-foreground">{timetableEntry.module} · {timetableEntry.code}</p>
            )}
          </div>
        </div>

        {/* Headcount Ring */}
        <div className="flex justify-center">
          <HeadcountRing
            count={room.count}
            total={timetableEntry?.enrolled || room.capacity}
          />
        </div>

        {/* Check-in Section */}
        <AnimatePresence mode="wait">
          {checkedIn ? (
            <motion.div
              key="success"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-col items-center gap-4 p-6 rounded-lg bg-accent/10 border border-accent/30"
            >
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
                <Check className="w-8 h-8 text-accent-foreground" />
              </div>
              <p className="font-display text-lg font-bold text-foreground">Checked in to {roomId} ✓</p>
              <Link
                to="/classpulse"
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Done
              </Link>
            </motion.div>
          ) : (
            <motion.div key="scanner" className="space-y-4">
              {/* Scanner */}
              {scanning ? (
                <div className="relative rounded-lg overflow-hidden border border-border bg-card">
                  <div id="qr-reader" ref={scannerRef} className="w-full" />
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Scanner decoration corners */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-accent rounded-tl" />
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-accent rounded-tr" />
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-accent rounded-bl" />
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-accent rounded-br" />
                    {/* Scan line */}
                    <div className="absolute left-4 right-4 h-0.5 bg-accent/60 animate-scan-line" />
                  </div>
                </div>
              ) : (
                <button
                  onClick={startScanner}
                  className="w-full flex items-center justify-center gap-2 p-6 rounded-lg border border-dashed border-border bg-card hover:bg-muted transition-colors"
                >
                  <Camera className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Tap to open camera scanner</span>
                </button>
              )}

              {/* Manual check-in */}
              <button
                onClick={handleCheckIn}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 transition-colors"
              >
                <Check className="w-4 h-4" />
                Check In Manually
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show QR code for demo */}
        <div className="space-y-2">
          <button
            onClick={() => setShowQR(!showQR)}
            className={cn(
              "flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            )}
          >
            <QrCode className="w-3.5 h-3.5" />
            {showQR ? "Hide QR Code" : "Show QR Code (for demo)"}
          </button>
          <AnimatePresence>
            {showQR && qrDataUrl && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden flex flex-col items-center gap-2 p-4 rounded-lg bg-card border border-border"
              >
                <img src={qrDataUrl} alt="QR Code" className="w-48 h-48 rounded" />
                <p className="text-xs text-muted-foreground font-mono">{timetableEntry?.qrCode}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
