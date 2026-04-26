"use client";

import { useState, useEffect } from "react";
import { format, isBefore, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2, CheckCircle2, ArrowLeft, Clock } from "lucide-react";

interface Slot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
}

type Step = "calendar" | "slots" | "form" | "success";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ScheduleCallModal({ open, onClose }: Props) {
  const [step, setStep] = useState<Step>("calendar");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep("calendar");
        setSelectedDate(undefined);
        setAvailableSlots([]);
        setSelectedSlot(null);
        setForm({ name: "", email: "", message: "" });
        setError("");
      }, 300);
    }
  }, [open]);

  async function fetchSlots(date: Date) {
    setLoadingSlots(true);
    setError("");
    try {
      const res = await fetch(`/api/schedule/slots?date=${format(date, "yyyy-MM-dd")}`);
      const data = await res.json();
      setAvailableSlots(data.slots ?? []);
      setStep("slots");
    } catch {
      setError("Failed to load slots.");
    } finally {
      setLoadingSlots(false);
    }
  }

  function handleDateSelect(date: Date | undefined) {
    if (!date) return;
    setSelectedDate(date);
    fetchSlots(date);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/schedule/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, slotId: selectedSlot._id, message: form.message }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong."); return; }
      setStep("success");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const today = startOfDay(new Date());
  const steps: Step[] = ["calendar", "slots", "form", "success"];
  const stepIdx = steps.indexOf(step);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md w-[calc(100vw-1rem)] sm:w-full min-h-[520px] max-h-[92vh] bg-background border-2 border-border rounded-none shadow-2xl p-0 overflow-hidden">
        {/* Terminal titlebar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b-2 border-border bg-muted">
          {(step === "slots" || step === "form") && (
            <button
              onClick={() => setStep(step === "form" ? "slots" : "calendar")}
              className="text-muted-foreground hover:text-foreground transition-colors mr-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
          )}
          <DialogHeader className="flex-1 p-0">
            <DialogTitle className="font-mono text-xs uppercase tracking-widest text-foreground text-left">
              {step === "calendar" && "schedule_call.sh — pick date"}
              {step === "slots"    && `schedule_call.sh — ${selectedDate ? format(selectedDate, "MMM d") : ""}`}
              {step === "form"     && "schedule_call.sh — your details"}
              {step === "success"  && "schedule_call.sh — queued ✓"}
            </DialogTitle>
            <DialogDescription className="sr-only">Schedule a call with Saswat</DialogDescription>
          </DialogHeader>
        </div>

        {/* Progress bar */}
        <div className="flex h-0.5 bg-border">
          {steps.map((s, idx) => (
            <div
              key={s}
              className={`flex-1 transition-colors ${idx <= stepIdx ? "bg-foreground" : "bg-transparent"}`}
            />
          ))}
        </div>

        <div className="p-4 sm:p-8 overflow-y-auto max-h-[calc(92vh-62px)]">
          {/* Step 1 — Calendar */}
          {step === "calendar" && (
            <div className="flex flex-col items-center gap-4">
              {loadingSlots ? (
                <div className="flex items-center gap-2 py-10 font-mono text-xs text-muted-foreground">
                  <Loader2 className="animate-spin h-3.5 w-3.5" />
                  loading slots...
                </div>
              ) : (
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => isBefore(startOfDay(date), today)}
                  className="border-2 border-border rounded-none bg-card"
                />
              )}
              {error && <p className="font-mono text-xs text-destructive">{error}</p>}
            </div>
          )}

          {/* Step 2 — Slots */}
          {step === "slots" && (
            <div className="flex flex-col gap-3">
              {loadingSlots ? (
                <div className="flex items-center gap-2 py-10 font-mono text-xs text-muted-foreground justify-center">
                  <Loader2 className="animate-spin h-3.5 w-3.5" />
                  loading...
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-center py-10">
                  <Clock className="h-8 w-8 mx-auto mb-3 text-muted-foreground/30" />
                  <p className="font-mono text-xs text-muted-foreground mb-4">→ no slots on this date</p>
                  <button
                    onClick={() => setStep("calendar")}
                    className="font-mono text-xs px-3 py-2 border-2 border-border text-foreground hover:bg-muted transition-colors"
                  >
                    ← pick another date
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot._id}
                      onClick={() => { setSelectedSlot(slot); setStep("form"); }}
                      className="border-2 border-border bg-card px-3 py-3 text-left hover:border-foreground/60 hover:bg-muted transition-all"
                    >
                      <span className="block font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-0.5">available</span>
                      <span className="font-mono text-sm font-bold text-foreground">{slot.startTime}</span>
                      <span className="font-mono text-xs text-muted-foreground"> – {slot.endTime}</span>
                    </button>
                  ))}
                </div>
              )}
              {error && <p className="font-mono text-xs text-destructive">{error}</p>}
            </div>
          )}

          {/* Step 3 — Form */}
          {step === "form" && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {selectedSlot && (
                <div className="font-mono text-[10px] text-accent border border-border px-3 py-2 bg-muted mb-1">
                  → Slot: {selectedSlot.startTime}–{selectedSlot.endTime} · {selectedSlot.date ? format(new Date(selectedSlot.date + "T00:00:00"), "MMM d, yyyy") : ""}
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">name</label>
                <input
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="bg-card border-2 border-border px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">email</label>
                <input
                  type="email"
                  placeholder="jane@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="bg-card border-2 border-border px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  what to discuss? <span className="normal-case text-muted-foreground/50">(optional)</span>
                </label>
                <textarea
                  placeholder="Brief description..."
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="bg-card border-2 border-border px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors resize-none"
                />
              </div>

              {error && <p className="font-mono text-xs text-destructive">{error}</p>}

              <button
                type="submit"
                disabled={submitting || !form.name.trim() || !form.email.trim()}
                className="w-full py-2.5 bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:bg-foreground/90 transition-colors border-2 border-foreground disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin h-3.5 w-3.5" />sending...</span>
                ) : (
                  "→ Request Call"
                )}
              </button>
            </form>
          )}

          {/* Step 4 — Success */}
          {step === "success" && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="border-2 border-foreground p-4">
                <CheckCircle2 className="h-8 w-8 text-foreground" />
              </div>
              <div>
                <p className="font-mono font-bold text-foreground mb-1">→ request queued</p>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                  check your inbox for confirmation.<br />
                  meet link arrives on approval.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2 border-2 border-border font-mono text-xs uppercase tracking-widest text-foreground hover:bg-muted transition-colors"
              >
                close
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
