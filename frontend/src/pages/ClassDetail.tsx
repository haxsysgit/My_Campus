import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, QrCode, Camera, Loader2, Users, MapPin, CalendarCheck, X } from "lucide-react";
import QRCode from "qrcode";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import HeadcountRing from "@/components/HeadcountRing";
import { cn } from "@/lib/utils";
import { DEMO_TIMETABLE, ROOM_CAPACITIES } from "@/lib/campusData";

interface Student {
  id: string;
  name: string;
  initials: string;
  student_id?: string;
  seat_row?: number;
  seat_col?: number;
  checked_in?: boolean;
}

interface ClassDetailData {
  class_info: {
    id: string;
    code: string;
    name: string;
    room: string;
    building_name?: string;
    headcount: { checked_in: number; total: number };
  };
  students: Student[];
  is_checked_in: boolean;
}

// Demo students for fallback
const DEMO_STUDENTS: Student[] = [
  { id: "1", name: "Alex Kumar", initials: "AK", student_id: "M01081164", seat_row: 0, seat_col: 2, checked_in: true },
  { id: "2", name: "Sarah Johnson", initials: "SJ", student_id: "M01082345", seat_row: 1, seat_col: 0, checked_in: true },
  { id: "3", name: "Mike Peters", initials: "MP", student_id: "M01083456", seat_row: 1, seat_col: 3, checked_in: true },
  { id: "4", name: "Emma Wilson", initials: "EW", student_id: "M01084567", seat_row: 2, seat_col: 1, checked_in: true },
  { id: "5", name: "James Chen", initials: "JC", student_id: "M01085678", seat_row: 2, seat_col: 4, checked_in: false },
  { id: "6", name: "Lisa Brown", initials: "LB", student_id: "M01086789", seat_row: 3, seat_col: 2, checked_in: true },
  { id: "7", name: "David Smith", initials: "DS", student_id: "M01087890", seat_row: 0, seat_col: 4, checked_in: false },
  { id: "8", name: "Amy Taylor", initials: "AT", student_id: "M01088901", seat_row: 3, seat_col: 0, checked_in: true },
];

export default function ClassDetail() {
  const { roomId } = useParams<{ roomId: string }>();
  const { toast } = useToast();
  const [classData, setClassData] = useState<ClassDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [bookedSeat, setBookedSeat] = useState<{ row: number; col: number } | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [pendingSeat, setPendingSeat] = useState<{ row: number; col: number } | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrRef = useRef<any>(null);

  const handleSeatClick = (row: number, col: number, isOccupied: boolean) => {
    if (isOccupied) return;
    setPendingSeat({ row, col });
    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    if (!pendingSeat) return;
    setBookedSeat(pendingSeat);
    setShowBookingModal(false);
    setPendingSeat(null);
    toast({
      title: "Seat reserved!",
      description: `Row ${pendingSeat.row + 1}, Seat ${pendingSeat.col + 1} is held for you.`,
    });
  };

  useEffect(() => {
    async function fetchClass() {
      if (!roomId) return;
      try {
        const data = await api.getClassDetail(roomId);
        if (data && data.class_info) {
          // Add demo students if none returned
          if (!data.students || data.students.length === 0) {
            data.students = DEMO_STUDENTS;
          }
          setClassData(data);
          setCheckedIn(data.is_checked_in);
        } else {
          // Fallback to demo data
          const demoEntry = DEMO_TIMETABLE.find(e => e.room === roomId) || DEMO_TIMETABLE[0];
          const roomInfo = ROOM_CAPACITIES[roomId] || { capacity: 35, buildingName: "Campus" };
          setClassData({
            class_info: {
              id: roomId || "R110",
              code: demoEntry.code,
              name: demoEntry.module,
              room: demoEntry.room,
              building_name: roomInfo.buildingName,
              headcount: { checked_in: DEMO_STUDENTS.filter(s => s.checked_in).length, total: demoEntry.enrolled },
            },
            students: DEMO_STUDENTS,
            is_checked_in: false,
          });
        }
      } catch (err: any) {
        // Fallback to demo data on error
        const demoEntry = DEMO_TIMETABLE.find(e => e.room === roomId) || DEMO_TIMETABLE[0];
        const roomInfo = ROOM_CAPACITIES[roomId || "R110"] || { capacity: 35, buildingName: "Campus" };
        setClassData({
          class_info: {
            id: roomId || "R110",
            code: demoEntry.code,
            name: demoEntry.module,
            room: demoEntry.room,
            building_name: roomInfo.buildingName,
            headcount: { checked_in: DEMO_STUDENTS.filter(s => s.checked_in).length, total: demoEntry.enrolled },
          },
          students: DEMO_STUDENTS,
          is_checked_in: false,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchClass();
  }, [roomId]);

  // Generate QR code for demo
  useEffect(() => {
    if (classData) {
      const qrCode = `CAMPUS:${classData.class_info.code}:DEMO:test`;
      QRCode.toDataURL(qrCode, {
        width: 256,
        margin: 2,
        color: { dark: "#F9FAFB", light: "#111827" },
      }).then(setQrDataUrl);
    }
  }, [classData]);

  const handleCheckIn = useCallback(async (qrCode?: string) => {
    if (!classData || checkedIn || checkingIn) return;
    setCheckingIn(true);
    try {
      const code = qrCode || `CAMPUS:${classData.class_info.code}:DEMO:test`;
      await api.checkInWithQR(code);
      setCheckedIn(true);
      setScanning(false);
      toast({ title: "Checked in!", description: `You're checked in to ${classData.class_info.name}` });
      // Stop scanner if running
      if (html5QrRef.current) {
        html5QrRef.current.stop().catch(() => {});
        html5QrRef.current = null;
      }
    } catch (err: any) {
      toast({ title: "Check-in failed", description: err.message, variant: "destructive" });
    } finally {
      setCheckingIn(false);
    }
  }, [classData, checkedIn, checkingIn, toast]);

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
          if (decodedText.startsWith("CAMPUS:")) {
            handleCheckIn(decodedText);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <p className="text-muted-foreground">Class not found</p>
      </div>
    );
  }

  const { class_info } = classData;

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
            <h1 className="font-display text-2xl font-bold text-foreground">{class_info.name}</h1>
            <p className="text-sm text-muted-foreground">
              {class_info.room} · {class_info.building_name || "Campus"}
            </p>
            <p className="text-xs text-muted-foreground">{class_info.code}</p>
          </div>
        </div>

        {/* Headcount Ring */}
        <div className="flex justify-center">
          <HeadcountRing
            count={class_info.headcount.checked_in}
            total={class_info.headcount.total}
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
              <p className="font-display text-lg font-bold text-foreground">Checked in to {class_info.name} ✓</p>
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
                onClick={() => handleCheckIn()}
                disabled={checkingIn}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {checkingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {checkingIn ? "Checking in..." : "Check In Manually"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Classroom Seat Map */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Classroom Layout
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {classData.students.filter(s => s.checked_in).length} seated · {(ROOM_CAPACITIES[class_info.room]?.capacity || 35) - classData.students.filter(s => s.checked_in).length} available
              </span>
              {!bookedSeat ? (
                <button
                  onClick={() => toast({ title: "Tap any empty seat", description: "Click a grey seat to reserve it" })}
                  className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <CalendarCheck className="w-3 h-3" /> Book Seat
                </button>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  <Check className="w-3 h-3" /> R{bookedSeat.row + 1}·S{bookedSeat.col + 1} reserved
                </span>
              )}
            </div>
          </div>
          
          {/* Seat Grid */}
          <div className="p-4 rounded-lg bg-card border border-border">
            {/* Lecturer area */}
            <div className="mb-4 pb-3 border-b border-border text-center">
              <div className="inline-block px-4 py-2 bg-muted rounded text-xs text-muted-foreground">
                📽️ Lecturer / Screen
              </div>
            </div>
            
            {/* Seat rows */}
            <div className="space-y-2">
              {[0, 1, 2, 3].map((row) => (
                <div key={row} className="flex justify-center gap-2">
                  {[0, 1, 2, 3, 4].map((col) => {
                    const student = classData.students.find(
                      (s) => s.seat_row === row && s.seat_col === col
                    );
                    const isOccupied = !!(student && student.checked_in);
                    const isYou = student?.student_id === "M01081164";
                    const isBooked = bookedSeat?.row === row && bookedSeat?.col === col;
                    
                    return (
                      <button
                        key={`${row}-${col}`}
                        onClick={() => handleSeatClick(row, col, isOccupied)}
                        disabled={isOccupied}
                        className={cn(
                          "w-10 h-10 rounded-md flex items-center justify-center text-xs font-semibold transition-all",
                          isYou
                            ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background cursor-default"
                            : isBooked
                            ? "bg-emerald-500 text-white ring-2 ring-emerald-400 ring-offset-1"
                            : isOccupied
                            ? "bg-accent/20 text-accent border border-accent/30 cursor-default"
                            : "bg-muted/50 text-muted-foreground border border-border hover:bg-primary/10 hover:border-primary hover:text-primary cursor-pointer"
                        )}
                        title={isBooked ? "Your reserved seat" : student ? `${student.name} (${student.student_id})` : "Empty — tap to book"}
                      >
                        {isBooked ? <Check className="w-3.5 h-3.5" /> : isOccupied ? student?.initials : ""}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="mt-4 pt-3 border-t border-border flex justify-center flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-primary" />
                <span className="text-muted-foreground">You</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-accent/20 border border-accent/30" />
                <span className="text-muted-foreground">Classmate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-muted/50 border border-border" />
                <span className="text-muted-foreground">Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-emerald-500" />
                <span className="text-muted-foreground">Reserved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seat Booking Modal */}
        <AnimatePresence>
          {showBookingModal && pendingSeat && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40"
              onClick={() => setShowBookingModal(false)}
            >
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm bg-card rounded-xl border border-border shadow-2xl p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-foreground flex items-center gap-2">
                    <CalendarCheck className="w-5 h-5 text-primary" />
                    Reserve Seat
                  </h3>
                  <button onClick={() => setShowBookingModal(false)} className="p-1 rounded hover:bg-muted">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Class</span>
                    <span className="font-medium">{class_info.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room</span>
                    <span className="font-medium">{class_info.room}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seat</span>
                    <span className="font-semibold text-primary">Row {pendingSeat.row + 1}, Seat {pendingSeat.col + 1}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your seat will be held until 10 minutes after class starts.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 py-2.5 rounded-lg border border-border text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmBooking}
                    className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Confirm Booking
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Classmates List */}
        <div className="space-y-3">
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Classmates Checked In
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {classData.students.filter(s => s.checked_in).map((student) => (
              <div
                key={student.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-card border border-border"
              >
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-semibold text-accent">
                  {student.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{student.name}</p>
                  <p className="text-xs text-muted-foreground">{student.student_id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

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
                <p className="text-xs text-muted-foreground font-mono">CAMPUS:{class_info.code}:DEMO:test</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
