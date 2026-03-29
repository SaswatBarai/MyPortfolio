"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BlockedSlot {
  _id: string;
  type: "full_day" | "time_range";
  date?: string;
  startTime?: string;
  endTime?: string;
  recurrence?: string;
  reason?: string;
  createdAt: string;
}

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState({
    type: "full_day" as "full_day" | "time_range",
    date: "",
    startTime: "",
    endTime: "",
    recurrence: "none",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/blocked-slots");
    const data = await res.json();
    setSlots(data.slots ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/blocked-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: form.type,
          date: form.date || undefined,
          startTime: form.startTime || undefined,
          endTime: form.endTime || undefined,
          recurrence: form.recurrence,
          reason: form.reason || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setForm({ type: "full_day", date: "", startTime: "", endTime: "", recurrence: "none", reason: "" });
      await fetchSlots();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this blocked slot?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/blocked-slots/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to delete");
      }
      await fetchSlots();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete slot");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <h1 className="text-2xl font-bold">Manage Availability</h1>

      {/* Add block form */}
      <section className="border rounded-xl p-6 space-y-5 bg-card">
        <h2 className="font-semibold text-lg">Block a Date / Time Range</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="full_day"
                checked={form.type === "full_day"}
                onChange={() => setForm({ ...form, type: "full_day" })}
              />
              <span className="text-sm">Full Day</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="time_range"
                checked={form.type === "time_range"}
                onChange={() => setForm({ ...form, type: "time_range" })}
              />
              <span className="text-sm">Time Range</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date (optional for recurring)</label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>

          {form.type === "time_range" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Time</label>
                <Input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Time</label>
                <Input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Recurrence</label>
            <select
              value={form.recurrence}
              onChange={(e) => setForm({ ...form, recurrence: e.target.value })}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm w-full"
            >
              <option value="none">None (one-time)</option>
              <option value="daily">Daily</option>
              <option value="weekdays">Weekdays (Mon–Fri)</option>
              <option value="weekends">Weekends (Sat–Sun)</option>
              <option value="weekly">Weekly (same day of week)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Reason (optional)</label>
            <Input
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="e.g. Holiday, Focus time"
            />
          </div>

          {submitError && <p className="text-sm text-red-500">{submitError}</p>}

          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving…" : "Add Block"}
          </Button>
        </form>
      </section>

      {/* Existing blocks */}
      <section className="space-y-4">
        <h2 className="font-semibold text-lg">Existing Blocks</h2>
        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : slots.length === 0 ? (
          <p className="text-muted-foreground">No blocks configured.</p>
        ) : (
          <div className="space-y-3">
            {slots.map((slot) => (
              <div
                key={slot._id}
                className="border rounded-xl p-4 flex items-center justify-between bg-card"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium capitalize">
                    {slot.type.replace("_", " ")}
                    {slot.recurrence && slot.recurrence !== "none" && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({slot.recurrence})
                      </span>
                    )}
                  </p>
                  {slot.date && (
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(slot.date), "MMMM d, yyyy")}
                    </p>
                  )}
                  {slot.startTime && slot.endTime && (
                    <p className="text-xs text-muted-foreground">
                      {slot.startTime} – {slot.endTime}
                    </p>
                  )}
                  {slot.reason && (
                    <p className="text-xs text-muted-foreground">{slot.reason}</p>
                  )}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deleting === slot._id}
                  onClick={() => handleDelete(slot._id)}
                >
                  {deleting === slot._id ? "…" : "Delete"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
