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
  startTime: string; // "HH:MM" 24h internally
  endTime: string;
}

interface BookedRange {
  startTime: string;
  endTime: string;
  status: "pending" | "approved";
}

type Step = "calendar" | "slots" | "form" | "success";

interface Props {
  open: boolean;
  onClose: () => void;
}

// ── time helpers ──────────────────────────────────────────────────────────────

function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function addMinutes(hhmm: string, mins: number): string {
  const total = toMinutes(hhmm) + mins;
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function hhmm_to_12h(hhmm: string): { hour: string; minute: string; period: "AM" | "PM" } {
  if (!hhmm) return { hour: "9", minute: "00", period: "AM" };
  const [h, m] = hhmm.split(":").map(Number);
  return {
    hour: String(h === 0 ? 12 : h > 12 ? h - 12 : h),
    minute: String(m).padStart(2, "0"),
    period: h >= 12 ? "PM" : "AM",
  };
}

function h12_to_hhmm(hour: string, minute: string, period: "AM" | "PM"): string {
  let h = Number(hour);
  if (period === "AM" && h === 12) h = 0;
  if (period === "PM" && h !== 12) h += 12;
  return `${String(h).padStart(2, "0")}:${minute}`;
}

function fmt12(hhmm: string): string {
  if (!hhmm) return "";
  const { hour, minute, period } = hhmm_to_12h(hhmm);
  return `${hour}:${minute} ${period}`;
}

// ── 12-hour start-time picker (end is auto-computed +1 hour) ─────────────────

const HOURS   = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINUTES = ["00", "15", "30", "45"];

const selectCls =
  "bg-card border-2 border-border px-2 py-2 font-mono text-sm text-foreground " +
  "focus:outline-none focus:border-foreground transition-colors appearance-none text-center cursor-pointer";

function StartTimePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const p = hhmm_to_12h(value);

  const emit = (hour: string, minute: string, period: "AM" | "PM") =>
    onChange(h12_to_hhmm(hour, minute, period));

  return (
    <div className="flex items-center gap-1">
      <select
        value={p.hour}
        onChange={(e) => emit(e.target.value, p.minute, p.period)}
        className={selectCls + " w-14"}
      >
        {HOURS.map((h) => (
          <option key={h} value={String(h)}>{h}</option>
        ))}
      </select>

      <span className="font-mono text-sm text-muted-foreground">:</span>

      <select
        value={p.minute}
        onChange={(e) => emit(p.hour, e.target.value, p.period)}
        className={selectCls + " w-14"}
      >
        {MINUTES.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => emit(p.hour, p.minute, p.period === "AM" ? "PM" : "AM")}
        className="px-2 py-2 border-2 border-border font-mono text-xs uppercase tracking-widest text-foreground hover:bg-muted transition-colors min-w-[3rem]"
      >
        {p.period}
      </button>
    </div>
  );
}

// ── modal ─────────────────────────────────────────────────────────────────────

export default function ScheduleCallModal({ open, onClose }: Props) {
  const [step, setStep] = useState<Step>("calendar");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [chosenStart, setChosenStart] = useState("");
  const [timeError, setTimeError] = useState("");
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
        setBookedRanges([]);
        setSelectedSlot(null);
        setChosenStart("");
        setTimeError("");
        setForm({ name: "", email: "", message: "" });
        setError("");
      }, 300);
    }
  }, [open]);

  async function fetchSlots(date: Date) {
    setLoadingSlots(true);
    setError("");
    setSelectedSlot(null);
    setChosenStart("");
    setTimeError("");
    try {
      const res = await fetch(`/api/schedule/slots?date=${format(date, "yyyy-MM-dd")}`);
      const data = await res.json();
      setAvailableSlots(data.slots ?? []);
      setBookedRanges(data.bookedRanges ?? []);
      if ((data.slots ?? []).length === 1) {
        const only = data.slots[0] as Slot;
        setSelectedSlot(only);
        setChosenStart(only.startTime);
      }
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

  // Derived: end is always start + 60 min
  const chosenEnd = chosenStart ? addMinutes(chosenStart, 60) : "";

  function validateChosenTime(): string {
    if (!selectedSlot) return "Select an availability window first";
    if (!chosenStart) return "Pick a start time";

    const ws = toMinutes(selectedSlot.startTime);
    let we = toMinutes(selectedSlot.endTime);
    const overnight = we <= ws;
    if (overnight) we += 1440;

    let s = toMinutes(chosenStart);
    let e = s + 60; // always 1 hour

    if (overnight && s < ws) s += 1440;
    e = s + 60;

    if (s < ws || e > we)
      return `1-hour meeting must fit within ${fmt12(selectedSlot.startTime)}–${fmt12(selectedSlot.endTime)}`;

    for (const br of bookedRanges) {
      // Only block on approved meetings (pending ones are "tentative")
      if (br.status !== "approved") continue;
      let brs = toMinutes(br.startTime);
      let bre = toMinutes(br.endTime);
      if (overnight) {
        if (brs < ws) brs += 1440;
        if (bre <= ws) bre += 1440;
      }
      if (s < bre && brs < e)
        return `Conflicts with an approved meeting (${fmt12(br.startTime)}–${fmt12(br.endTime)})`;
    }
    return "";
  }

  function handleContinueToForm() {
    const err = validateChosenTime();
    if (err) { setTimeError(err); return; }
    setTimeError("");
    setStep("form");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot) return;
    const err = validateChosenTime();
    if (err) { setError(err); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/schedule/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          slotId: selectedSlot._id,
          startTime: chosenStart,
          endTime: chosenEnd,
          message: form.message,
        }),
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
                  <Loader2 className="animate-spin h-3.5 w-3.5" />loading slots...
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

          {/* Step 2 — Pick time within availability window */}
          {step === "slots" && (
            <div className="flex flex-col gap-4">
              {loadingSlots ? (
                <div className="flex items-center gap-2 py-10 font-mono text-xs text-muted-foreground justify-center">
                  <Loader2 className="animate-spin h-3.5 w-3.5" />loading...
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-center py-10">
                  <Clock className="h-8 w-8 mx-auto mb-3 text-muted-foreground/30" />
                  <p className="font-mono text-xs text-muted-foreground mb-4">→ no availability on this date</p>
                  <button
                    onClick={() => setStep("calendar")}
                    className="font-mono text-xs px-3 py-2 border-2 border-border text-foreground hover:bg-muted transition-colors"
                  >
                    ← pick another date
                  </button>
                </div>
              ) : (
                <>
                  {availableSlots.length > 1 && (
                    <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                      select a window
                    </p>
                  )}

                  {/* Availability window cards */}
                  <div className={`grid gap-2 ${availableSlots.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                    {availableSlots.map((slot) => (
                      <button
                        key={slot._id}
                        onClick={() => {
                          setSelectedSlot(slot);
                          setChosenStart(slot.startTime);
                          setTimeError("");
                        }}
                        className={`border-2 px-3 py-3 text-left transition-all ${
                          selectedSlot?._id === slot._id
                            ? "border-foreground bg-muted"
                            : "border-border bg-card hover:border-foreground/60 hover:bg-muted"
                        }`}
                      >
                        <span className="block font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-0.5">
                          available
                        </span>
                        <span className="font-mono text-sm font-bold text-foreground">
                          {fmt12(slot.startTime)}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {" "}– {fmt12(slot.endTime)}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Time picker panel */}
                  {selectedSlot && (
                    <div className="border-2 border-border p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                          pick start · window {fmt12(selectedSlot.startTime)}–{fmt12(selectedSlot.endTime)}
                          {toMinutes(selectedSlot.endTime) <= toMinutes(selectedSlot.startTime) && (
                            <span className="ml-1 text-muted-foreground/60">(next day)</span>
                          )}
                        </p>
                        <span className="font-mono text-[9px] text-accent border border-accent/30 px-1.5 py-0.5 shrink-0">
                          1 hr fixed
                        </span>
                      </div>

                      {/* Already-scheduled meetings */}
                      {bookedRanges.length > 0 && (
                        <div className="flex flex-col gap-1.5">
                          <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60">
                            already scheduled
                          </p>
                          <div className="flex flex-col gap-1">
                            {bookedRanges.map((br, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span className={`font-mono text-[9px] border px-1.5 py-0.5 shrink-0 ${
                                  br.status === "approved"
                                    ? "border-destructive/60 text-destructive/80 bg-destructive/5"
                                    : "border-yellow-500/40 text-yellow-500/80 bg-yellow-500/5"
                                }`}>
                                  {br.status === "approved" ? "confirmed" : "pending"}
                                </span>
                                <span className="font-mono text-[9px] text-muted-foreground">
                                  {fmt12(br.startTime)} – {fmt12(br.endTime)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Start time + auto end */}
                      <div className="flex flex-col gap-1">
                        <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                          start time
                        </label>
                        <StartTimePicker
                          value={chosenStart || selectedSlot.startTime}
                          onChange={(v) => { setChosenStart(v); setTimeError(""); }}
                        />
                      </div>

                      {chosenStart && (
                        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground border border-border bg-muted/50 px-3 py-2">
                          <Clock className="h-3 w-3 shrink-0" />
                          <span>
                            {fmt12(chosenStart)} → {fmt12(chosenEnd)}
                            <span className="ml-2 text-[10px] text-accent">(60 min)</span>
                          </span>
                        </div>
                      )}

                      {timeError && (
                        <p className="font-mono text-xs text-destructive">{timeError}</p>
                      )}

                      <button
                        onClick={handleContinueToForm}
                        className="w-full py-2.5 bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:bg-foreground/90 border-2 border-foreground transition-colors"
                      >
                        continue →
                      </button>
                    </div>
                  )}
                </>
              )}
              {error && <p className="font-mono text-xs text-destructive">{error}</p>}
            </div>
          )}

          {/* Step 3 — Form */}
          {step === "form" && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {selectedSlot && (
                <div className="font-mono text-[10px] text-accent border border-border px-3 py-2 bg-muted mb-1">
                  → {fmt12(chosenStart)}–{fmt12(chosenEnd)} · 60 min ·{" "}
                  {format(new Date(selectedSlot.date + "T00:00:00"), "MMM d, yyyy")}
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
                  what to discuss?{" "}
                  <span className="normal-case text-muted-foreground/50">(optional)</span>
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
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin h-3.5 w-3.5" />sending...
                  </span>
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
