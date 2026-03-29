"use client";

import { useState, useEffect, useCallback } from "react";
import { DayPicker } from "react-day-picker";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type Step = "date" | "time" | "form" | "confirm";

interface AvailabilityData {
  availability: Record<string, string[]>;
  disabledDates: string[];
}

interface FormData {
  viewerName: string;
  viewerEmail: string;
  reason: string;
  requestedDuration: number;
}

export default function BookPage() {
  const [step, setStep] = useState<Step>("date");
  const [availability, setAvailability] = useState<AvailabilityData | null>(null);
  const [loadingAvail, setLoadingAvail] = useState(true);
  const [availError, setAvailError] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [form, setForm] = useState<FormData>({
    viewerName: "",
    viewerEmail: "",
    reason: "",
    requestedDuration: 30,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submittedTicket, setSubmittedTicket] = useState<Record<string, unknown> | null>(null);

  const fetchAvailability = useCallback(async (month?: string) => {
    setLoadingAvail(true);
    try {
      const url = month ? `/api/availability?month=${month}` : "/api/availability";
      const res = await fetch(url);
      const data = await res.json();
      setAvailability(data);
      setAvailError("");
    } catch {
      setAvailError("Failed to load availability. Please refresh and try again.");
    } finally {
      setLoadingAvail(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const disabledDays = availability?.disabledDates?.map((d) => parseISO(d)) ?? [];

  const availableSlots =
    selectedDate && availability?.availability
      ? availability.availability[format(selectedDate, "yyyy-MM-dd")] ?? []
      : [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          preferredDate: selectedDate.toISOString(),
          preferredTime: selectedTime,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to submit");
      setSubmittedTicket(data.ticket);
      setStep("confirm");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link
          href="/schedule"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </Link>

        {/* Step indicator */}
        {step !== "confirm" && (
          <div className="flex gap-2 mb-8">
            {(["date", "time", "form"] as const).map((s, i) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full ${
                  ["date", "time", "form"].indexOf(step) >= i
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        )}

        {/* Step: Date */}
        {step === "date" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Select a Date</h1>
            {loadingAvail ? (
              <p className="text-muted-foreground">Loading availability…</p>
            ) : availError ? (
              <p className="text-sm text-red-500">{availError}</p>
            ) : (
              <>
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={[{ before: new Date() }, ...disabledDays]}
                  onMonthChange={(month) =>
                    fetchAvailability(format(month, "yyyy-MM"))
                  }
                  className="border rounded-xl p-4"
                />
                <Button
                  disabled={!selectedDate}
                  onClick={() => setStep("time")}
                  className="w-full"
                >
                  Next: Choose a Time
                </Button>
              </>
            )}
          </div>
        )}

        {/* Step: Time */}
        {step === "time" && selectedDate && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">
              Select a Time
            </h1>
            <p className="text-muted-foreground">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </p>

            {availableSlots.length === 0 ? (
              <p className="text-muted-foreground">
                No available slots on this day. Please go back and pick another
                date.
              </p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                      selectedTime === slot
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:border-primary hover:bg-primary/5"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("date")}>
                Back
              </Button>
              <Button
                disabled={!selectedTime}
                onClick={() => setStep("form")}
                className="flex-1"
              >
                Next: Your Details
              </Button>
            </div>
          </div>
        )}

        {/* Step: Form */}
        {step === "form" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Your Details</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={form.viewerName}
                  onChange={(e) => setForm({ ...form, viewerName: e.target.value })}
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={form.viewerEmail}
                  onChange={(e) => setForm({ ...form, viewerEmail: e.target.value })}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Reason for the call
                </label>
                <textarea
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Tell me a bit about what you'd like to discuss…"
                  required
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Preferred duration
                </label>
                <select
                  value={form.requestedDuration}
                  onChange={(e) =>
                    setForm({ ...form, requestedDuration: Number(e.target.value) })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {[15, 30, 45, 60].map((d) => (
                    <option key={d} value={d}>
                      {d} minutes
                    </option>
                  ))}
                </select>
              </div>

              {submitError && (
                <p className="text-sm text-red-500">{submitError}</p>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("time")}
                >
                  Back
                </Button>
                <Button type="submit" disabled={submitting} className="flex-1">
                  {submitting ? "Submitting…" : "Request Call"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Step: Confirmation */}
        {step === "confirm" && submittedTicket && (
          <div className="space-y-6 text-center">
            <div className="text-5xl">🎉</div>
            <h1 className="text-2xl font-bold">Request Submitted!</h1>
            <p className="text-muted-foreground">
              Your call request has been received. You&apos;ll get an email once it&apos;s
              confirmed.
            </p>
            <div className="bg-muted rounded-xl p-6 text-left space-y-3 text-sm">
              <div>
                <span className="font-medium">Date: </span>
                {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
              </div>
              <div>
                <span className="font-medium">Time: </span>
                {selectedTime}
              </div>
              <div>
                <span className="font-medium">Duration: </span>
                {form.requestedDuration} minutes
              </div>
              <div>
                <span className="font-medium">Name: </span>
                {form.viewerName}
              </div>
              <div>
                <span className="font-medium">Email: </span>
                {form.viewerEmail}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button asChild variant="outline">
                <Link href="/schedule/manage">Manage My Bookings</Link>
              </Button>
              <Button asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
