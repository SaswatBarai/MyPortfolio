"use client";

import { useState, useEffect } from "react";
import { format, isBefore, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    const dateStr = format(date, "yyyy-MM-dd");
    try {
      const res = await fetch(`/api/schedule/slots?date=${dateStr}`);
      const data = await res.json();
      setAvailableSlots(data.slots ?? []);
      setStep("slots");
    } catch {
      setError("Failed to load slots. Please try again.");
    } finally {
      setLoadingSlots(false);
    }
  }

  function handleDateSelect(date: Date | undefined) {
    if (!date) return;
    setSelectedDate(date);
    fetchSlots(date);
  }

  function handleSlotSelect(slot: Slot) {
    setSelectedSlot(slot);
    setStep("form");
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
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          slotId: selectedSlot._id,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStep("success");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const today = startOfDay(new Date());

  const stepLabel = {
    calendar: "Pick a date",
    slots: "Choose a time",
    form: "Your details",
    success: "All set!",
  }[step];

  const stepDesc = {
    calendar: "Select a date to see available slots.",
    slots: selectedDate
      ? `Available on ${format(selectedDate, "MMMM d, yyyy")}`
      : "",
    form: selectedSlot
      ? `${selectedSlot.startTime}–${selectedSlot.endTime} · ${selectedSlot.date ? format(new Date(selectedSlot.date + "T00:00:00"), "MMM d, yyyy") : ""}`
      : "",
    success: "Your request has been received.",
  }[step];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md w-full bg-card border border-border shadow-2xl p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            {(step === "slots" || step === "form") && (
              <button
                onClick={() => setStep(step === "form" ? "slots" : "calendar")}
                className="text-muted-foreground hover:text-foreground transition-colors mr-1"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <div>
              <DialogTitle className="text-base font-semibold text-foreground">
                {stepLabel}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {stepDesc}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-5">
          {/* Step 1 — Calendar */}
          {step === "calendar" && (
            <div className="flex flex-col items-center gap-4">
              {loadingSlots ? (
                <div className="flex items-center gap-2 py-10 text-muted-foreground text-sm">
                  <Loader2 className="animate-spin h-4 w-4" />
                  Loading slots…
                </div>
              ) : (
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => isBefore(startOfDay(date), today)}
                  className="rounded-lg border border-border bg-background"
                />
              )}
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
          )}

          {/* Step 2 — Slots */}
          {step === "slots" && (
            <div className="flex flex-col gap-3">
              {loadingSlots ? (
                <div className="flex items-center gap-2 py-10 text-muted-foreground text-sm justify-center">
                  <Loader2 className="animate-spin h-4 w-4" />
                  Loading…
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">
                  <Clock className="h-8 w-8 mx-auto mb-3 opacity-30" />
                  <p className="mb-4">No slots available on this date.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border text-foreground hover:bg-muted"
                    onClick={() => setStep("calendar")}
                  >
                    Pick another date
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot._id}
                      onClick={() => handleSlotSelect(slot)}
                      className="rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-foreground text-left hover:border-foreground/40 hover:bg-muted transition-colors"
                    >
                      <span className="block text-xs text-muted-foreground mb-0.5">Available</span>
                      {slot.startTime} – {slot.endTime}
                    </button>
                  ))}
                </div>
              )}
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
          )}

          {/* Step 3 — Form */}
          {step === "form" && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="name" className="text-xs text-muted-foreground uppercase tracking-wide">
                  Full name
                </Label>
                <Input
                  id="name"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground/50"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="email" className="text-xs text-muted-foreground uppercase tracking-wide">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground/50"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="message" className="text-xs text-muted-foreground uppercase tracking-wide">
                  What would you like to discuss?{" "}
                  <span className="normal-case text-muted-foreground/60">(optional)</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder="A brief description…"
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground/50 resize-none"
                />
              </div>

              {error && <p className="text-xs text-destructive">{error}</p>}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-foreground text-background hover:bg-foreground/90 font-medium mt-1"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Sending…
                  </>
                ) : (
                  "Request Call"
                )}
              </Button>
            </form>
          )}

          {/* Step 4 — Success */}
          {step === "success" && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 text-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Request sent!</p>
                <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                  Check your inbox for a confirmation.<br />
                  Once approved, you'll receive a Google Meet link.
                </p>
              </div>
              <Button
                onClick={onClose}
                variant="outline"
                className="mt-1 border-border text-foreground hover:bg-muted"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
