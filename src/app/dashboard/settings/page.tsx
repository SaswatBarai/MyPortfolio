"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface WorkingHour {
  day: string;
  start: string;
  end: string;
}

interface Settings {
  workingHours: WorkingHour[];
  defaultDurations: number[];
  timezone: string;
}

const DEFAULT_SETTINGS: Settings = {
  workingHours: DAYS.slice(0, 5).map((day) => ({
    day,
    start: "10:00",
    end: "18:00",
  })),
  defaultDurations: [15, 30, 45, 60],
  timezone: "Asia/Kolkata",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) setSettings(d.settings);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function toggleDay(day: string) {
    const exists = settings.workingHours.find((wh) => wh.day === day);
    if (exists) {
      setSettings({
        ...settings,
        workingHours: settings.workingHours.filter((wh) => wh.day !== day),
      });
    } else {
      setSettings({
        ...settings,
        workingHours: [
          ...settings.workingHours,
          { day, start: "10:00", end: "18:00" },
        ].sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day)),
      });
    }
  }

  function updateHour(day: string, field: "start" | "end", value: string) {
    setSettings({
      ...settings,
      workingHours: settings.workingHours.map((wh) =>
        wh.day === day ? { ...wh, [field]: value } : wh
      ),
    });
  }

  function toggleDuration(d: number) {
    const exists = settings.defaultDurations.includes(d);
    setSettings({
      ...settings,
      defaultDurations: exists
        ? settings.defaultDurations.filter((x) => x !== d)
        : [...settings.defaultDurations, d].sort((a, b) => a - b),
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    setSaved(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-2xl font-bold">Settings</h1>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Working Hours */}
        <section className="border rounded-xl p-6 space-y-4 bg-card">
          <h2 className="font-semibold text-lg">Working Hours</h2>
          {DAYS.map((day) => {
            const wh = settings.workingHours.find((w) => w.day === day);
            const active = !!wh;
            return (
              <div key={day} className="flex items-center gap-4">
                <label className="flex items-center gap-2 w-28 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleDay(day)}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">{day.slice(0, 3)}</span>
                </label>
                {active && (
                  <>
                    <Input
                      type="time"
                      value={wh!.start}
                      onChange={(e) => updateHour(day, "start", e.target.value)}
                      className="w-32"
                    />
                    <span className="text-muted-foreground text-sm">to</span>
                    <Input
                      type="time"
                      value={wh!.end}
                      onChange={(e) => updateHour(day, "end", e.target.value)}
                      className="w-32"
                    />
                  </>
                )}
              </div>
            );
          })}
        </section>

        {/* Default Durations */}
        <section className="border rounded-xl p-6 space-y-4 bg-card">
          <h2 className="font-semibold text-lg">Default Durations</h2>
          <div className="flex gap-3 flex-wrap">
            {[15, 30, 45, 60].map((d) => (
              <label
                key={d}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                  settings.defaultDurations.includes(d)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border"
                }`}
              >
                <input
                  type="checkbox"
                  checked={settings.defaultDurations.includes(d)}
                  onChange={() => toggleDuration(d)}
                  className="sr-only"
                />
                {d} min
              </label>
            ))}
          </div>
        </section>

        {/* Timezone */}
        <section className="border rounded-xl p-6 space-y-4 bg-card">
          <h2 className="font-semibold text-lg">Timezone</h2>
          <Input
            value={settings.timezone}
            onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
            placeholder="e.g. Asia/Kolkata"
          />
        </section>

        {saveError && <p className="text-sm text-red-500">{saveError}</p>}
        {saved && <p className="text-sm text-green-500">Settings saved!</p>}

        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}
