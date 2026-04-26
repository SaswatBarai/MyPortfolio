"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  CheckCircle2, XCircle, Clock, Loader2, LogOut,
  Plus, Trash2, ExternalLink, Calendar, Mail, User, RefreshCcw, AlertCircle,
} from "lucide-react";

interface ScheduleRequest {
  _id: string;
  name: string;
  email: string;
  date: string;
  startTime: string;
  endTime: string;
  message?: string;
  status: "pending" | "approved" | "rejected";
  meetLink?: string;
  createdAt: string;
}

interface Slot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  booked: boolean;
}

type DayConfig = { free: boolean; startTime: string; endTime: string };

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const statusMeta = {
  pending:  { label: "pending",  Icon: Clock,        cls: "text-muted-foreground border-border" },
  approved: { label: "approved", Icon: CheckCircle2, cls: "text-green-400 border-green-500/30" },
  rejected: { label: "rejected", Icon: XCircle,      cls: "text-red-400 border-red-500/30" },
};

type TabKey = "pending" | "approved" | "rejected" | "slots";

const defaultWeeklyConfig = (): DayConfig[] => [
  { free: false, startTime: "09:00", endTime: "17:00" }, // Sun — no free
  { free: true,  startTime: "09:00", endTime: "17:00" }, // Mon — free
  { free: true,  startTime: "09:00", endTime: "17:00" }, // Tue — free
  { free: true,  startTime: "09:00", endTime: "17:00" }, // Wed — free
  { free: true,  startTime: "09:00", endTime: "17:00" }, // Thu — free
  { free: true,  startTime: "09:00", endTime: "17:00" }, // Fri — free
  { free: false, startTime: "09:00", endTime: "17:00" }, // Sat — no free
];

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("pending");

  const [requests, setRequests] = useState<ScheduleRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [newSlot, setNewSlot] = useState({ date: "", startTime: "", endTime: "" });
  const [addingSlot, setAddingSlot] = useState(false);
  const [slotError, setSlotError] = useState("");
  const [requestError, setRequestError] = useState("");
  const [notice, setNotice] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const [slotMode, setSlotMode] = useState<"manual" | "prebuild">("manual");
  const [weeksAhead, setWeeksAhead] = useState(2);
  const [generating, setGenerating] = useState(false);
  const [weeklyConfig, setWeeklyConfig] = useState<DayConfig[]>(defaultWeeklyConfig);

  const fetchRequests = useCallback(async () => {
    setLoadingRequests(true);
    setRequestError("");
    try {
      const res = await fetch("/api/schedule/requests");
      if (res.status === 401) { router.push("/dashboard/login"); return; }
      const data = await res.json();
      if (!res.ok) { setRequestError(data.error ?? "Could not load requests."); return; }
      setRequests(data.requests ?? []);
    } catch {
      setRequestError("Network error while loading requests.");
    } finally {
      setLoadingRequests(false);
    }
  }, [router]);

  const fetchSlots = useCallback(async () => {
    setLoadingSlots(true);
    try {
      const res = await fetch("/api/schedule/slots");
      const data = await res.json();
      if (!res.ok) { setSlotError(data.error ?? "Could not load slots."); return; }
      setSlots(data.slots ?? []);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
    fetchSlots();
  }, [fetchRequests, fetchSlots]);

  async function handleApprove(id: string) {
    setActionLoading(id + "-approve");
    try {
      const res = await fetch(`/api/schedule/approve/${id}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) { alert(data.error ?? "Failed to approve"); return; }
      await fetchRequests();
      setNotice("→ Request approved. Calendar invite sent.");
    } finally { setActionLoading(null); }
  }

  async function handleReject(id: string) {
    if (!confirm("Reject this call request?")) return;
    setActionLoading(id + "-reject");
    try {
      const res = await fetch(`/api/schedule/reject/${id}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) { alert(data.error ?? "Failed to reject"); return; }
      await fetchRequests();
      await fetchSlots();
      setNotice("→ Request rejected.");
    } finally { setActionLoading(null); }
  }

  async function handleAddSlot(e: React.FormEvent) {
    e.preventDefault();
    setSlotError("");
    setAddingSlot(true);
    try {
      const res = await fetch("/api/schedule/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSlot),
      });
      const data = await res.json();
      if (!res.ok) { setSlotError(data.error ?? "Failed to add slot"); return; }
      setNewSlot({ date: "", startTime: "", endTime: "" });
      await fetchSlots();
      setNotice("→ Slot added.");
    } finally { setAddingSlot(false); }
  }

  async function handleGeneratePrebuild() {
    setSlotError("");
    setGenerating(true);
    let totalCreated = 0;
    let totalSkipped = 0;
    try {
      const today = new Date();
      const startDate = today.toISOString().slice(0, 10);
      const end = new Date(today);
      end.setDate(end.getDate() + weeksAhead * 7);
      const endDate = end.toISOString().slice(0, 10);

      for (let day = 0; day < 7; day++) {
        const cfg = weeklyConfig[day];
        if (!cfg.free) continue;
        const res = await fetch("/api/schedule/slots", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "weekly",
            startDate,
            endDate,
            weekdays: [day],
            startTime: cfg.startTime,
            endTime: cfg.endTime,
          }),
        });
        const data = await res.json();
        if (!res.ok) { setSlotError(data.error ?? "Failed to generate slots"); return; }
        totalCreated += data.createdCount ?? 0;
        totalSkipped += data.skippedCount ?? 0;
      }

      await fetchSlots();
      setNotice(`→ Generated ${totalCreated} slots (${totalSkipped} duplicates skipped).`);
    } finally {
      setGenerating(false);
    }
  }

  async function handleDeleteSlot(id: string) {
    if (!confirm("Delete this slot?")) return;
    await fetch(`/api/schedule/slots?id=${id}`, { method: "DELETE" });
    await fetchSlots();
    setNotice("→ Slot deleted.");
  }

  async function handleRefresh() {
    setRefreshing(true);
    await Promise.all([fetchRequests(), fetchSlots()]);
    setRefreshing(false);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/dashboard/login");
  }

  function toggleDay(dayIdx: number) {
    setWeeklyConfig((prev) =>
      prev.map((d, i) => i === dayIdx ? { ...d, free: !d.free } : d)
    );
  }

  function updateDayTime(dayIdx: number, field: "startTime" | "endTime", value: string) {
    setWeeklyConfig((prev) =>
      prev.map((d, i) => i === dayIdx ? { ...d, [field]: value } : d)
    );
  }

  const pending  = requests.filter((r) => r.status === "pending");
  const approved = requests.filter((r) => r.status === "approved");
  const rejected = requests.filter((r) => r.status === "rejected");

  function formatSlot(date: string, start: string, end: string) {
    return `${format(new Date(date + "T00:00:00"), "MMM d, yyyy")} · ${start}–${end}`;
  }

  function RequestCard({ req }: { req: ScheduleRequest }) {
    const { label, Icon, cls } = statusMeta[req.status];
    return (
      <div className="border-2 border-border bg-card hover:border-foreground/30 transition-colors">
        <div className="flex items-center justify-between px-4 py-2 border-b-2 border-border bg-muted">
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="font-mono text-xs font-bold text-foreground">{req.name}</span>
          </div>
          <span className={`font-mono text-[10px] uppercase tracking-widest border px-1.5 py-0.5 flex items-center gap-1 ${cls}`}>
            <Icon className="h-2.5 w-2.5" />
            {label}
          </span>
        </div>

        <div className="p-4 space-y-2.5">
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
            <a href={`mailto:${req.email}`} className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors truncate">
              {req.email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="font-mono text-xs text-foreground/80">{formatSlot(req.date, req.startTime, req.endTime)}</span>
          </div>

          {req.message && (
            <p className="font-mono text-[11px] text-muted-foreground border border-border bg-background px-3 py-2 leading-relaxed">
              &quot;{req.message}&quot;
            </p>
          )}

          {req.status === "approved" && req.meetLink && (
            <a
              href={req.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] text-accent hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              open meet link →
            </a>
          )}

          {req.status === "pending" && (
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => handleApprove(req._id)}
                disabled={!!actionLoading}
                className="flex-1 py-2 bg-foreground text-background font-mono text-[11px] uppercase tracking-widest hover:bg-foreground/90 transition-colors border-2 border-foreground disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {actionLoading === req._id + "-approve"
                  ? <Loader2 className="animate-spin h-3 w-3" />
                  : <><CheckCircle2 className="h-3 w-3" /> approve</>
                }
              </button>
              <button
                onClick={() => handleReject(req._id)}
                disabled={!!actionLoading}
                className="flex-1 py-2 bg-transparent text-muted-foreground font-mono text-[11px] uppercase tracking-widest hover:text-foreground hover:bg-muted transition-colors border-2 border-border disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {actionLoading === req._id + "-reject"
                  ? <Loader2 className="animate-spin h-3 w-3" />
                  : <><XCircle className="h-3 w-3" /> reject</>
                }
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  function EmptyRow({ label }: { label: string }) {
    return (
      <div className="border-2 border-dashed border-border text-center py-14">
        <p className="font-mono text-xs text-muted-foreground">→ {label}</p>
      </div>
    );
  }

  const tabs: { key: TabKey; label: string; badge?: number }[] = [
    { key: "pending",  label: "pending",  badge: pending.length  },
    { key: "approved", label: "approved" },
    { key: "rejected", label: "rejected" },
    { key: "slots",    label: "manage slots" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b-2 border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex items-start sm:items-center justify-between px-3 sm:px-6 py-3 gap-2">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">admin_dashboard.sh</span>
            <p className="font-mono text-[11px] sm:text-xs font-bold text-foreground">Saswat Barai · Dashboard</p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-1.5 sm:p-2 border-2 border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors disabled:opacity-50"
            >
              {refreshing
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <RefreshCcw className="h-3.5 w-3.5" />
              }
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-border font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
            >
              <LogOut className="h-3 w-3" />
              logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Notice */}
        {notice && (
          <div className="mb-4 border border-border bg-card px-3 py-2 flex items-center justify-between font-mono text-xs text-foreground">
            <span>{notice}</span>
            <button onClick={() => setNotice("")} className="text-muted-foreground hover:text-foreground ml-4">×</button>
          </div>
        )}
        {requestError && (
          <div className="mb-4 border border-destructive/50 bg-destructive/10 px-3 py-2 flex items-center gap-2 font-mono text-xs text-destructive">
            <AlertCircle className="h-3 w-3 shrink-0" />
            {requestError}
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 border-2 border-border mb-6">
          {[
            { label: "pending",  count: pending.length,  cls: "text-foreground" },
            { label: "approved", count: approved.length, cls: "text-green-400" },
            { label: "rejected", count: rejected.length, cls: "text-red-400" },
          ].map((s, i) => (
            <div
              key={s.label}
              className={`text-center py-4 ${i < 2 ? "border-r-2 border-border" : ""}`}
            >
              <p className={`font-mono text-2xl sm:text-3xl font-bold ${s.cls}`}>{s.count}</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div className="grid grid-cols-2 sm:flex border-2 border-border mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-2 sm:px-3 py-2 font-mono text-[10px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-widest transition-colors border-r border-border even:border-r-0 sm:even:border-r last:border-r-0 relative ${
                activeTab === tab.key
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`ml-1.5 font-mono text-[9px] px-1 ${activeTab === tab.key ? "bg-background/20 text-background" : "bg-foreground/10 text-foreground"}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Pending */}
        {activeTab === "pending" && (
          loadingRequests
            ? <div className="flex items-center gap-2 py-14 justify-center font-mono text-xs text-muted-foreground"><Loader2 className="animate-spin h-3.5 w-3.5" />loading…</div>
            : pending.length === 0
              ? <EmptyRow label="no pending requests" />
              : <div className="grid gap-3 lg:grid-cols-2">{pending.map((r) => <RequestCard key={r._id} req={r} />)}</div>
        )}

        {/* Approved */}
        {activeTab === "approved" && (
          loadingRequests
            ? <div className="flex items-center gap-2 py-14 justify-center font-mono text-xs text-muted-foreground"><Loader2 className="animate-spin h-3.5 w-3.5" />loading…</div>
            : approved.length === 0
              ? <EmptyRow label="no approved calls yet" />
              : <div className="grid gap-3 lg:grid-cols-2">{approved.map((r) => <RequestCard key={r._id} req={r} />)}</div>
        )}

        {/* Rejected */}
        {activeTab === "rejected" && (
          loadingRequests
            ? <div className="flex items-center gap-2 py-14 justify-center font-mono text-xs text-muted-foreground"><Loader2 className="animate-spin h-3.5 w-3.5" />loading…</div>
            : rejected.length === 0
              ? <EmptyRow label="no rejected requests" />
              : <div className="grid gap-3 lg:grid-cols-2">{rejected.map((r) => <RequestCard key={r._id} req={r} />)}</div>
        )}

        {/* Slots */}
        {activeTab === "slots" && (
          <div className="grid gap-6 lg:grid-cols-2">

            {/* Add slot panel */}
            <div className="border-2 border-border">
              {/* Panel header with mode toggle */}
              <div className="border-b-2 border-border bg-muted px-4 py-2 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">add_slot.sh</span>
                <div className="flex border border-border overflow-hidden">
                  <button
                    onClick={() => setSlotMode("manual")}
                    className={`px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest transition-colors ${
                      slotMode === "manual" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    manual
                  </button>
                  <button
                    onClick={() => setSlotMode("prebuild")}
                    className={`px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest border-l border-border transition-colors ${
                      slotMode === "prebuild" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    prebuild
                  </button>
                </div>
              </div>

              {/* Manual mode */}
              {slotMode === "manual" && (
                <form onSubmit={handleAddSlot} className="p-4 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">date</label>
                    <input
                      type="date"
                      value={newSlot.date}
                      onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                      min={new Date().toISOString().slice(0, 10)}
                      required
                      className="bg-card border-2 border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:border-foreground transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">start</label>
                      <input
                        type="time"
                        value={newSlot.startTime}
                        onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                        required
                        className="bg-card border-2 border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:border-foreground transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">end</label>
                      <input
                        type="time"
                        value={newSlot.endTime}
                        onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                        required
                        className="bg-card border-2 border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:border-foreground transition-colors"
                      />
                    </div>
                  </div>
                  {slotError && <p className="font-mono text-xs text-destructive">{slotError}</p>}
                  <button
                    type="submit"
                    disabled={addingSlot}
                    className="w-full py-2.5 bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:bg-foreground/90 border-2 border-foreground transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {addingSlot ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    add slot
                  </button>
                </form>
              )}

              {/* Prebuild mode */}
              {slotMode === "prebuild" && (
                <div className="p-4 flex flex-col gap-4">
                  {/* Weeks ahead selector */}
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">generate for next</label>
                    <div className="flex gap-1.5 flex-wrap">
                      {[1, 2, 3, 4, 6, 8].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setWeeksAhead(w)}
                          className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest border transition-colors ${
                            weeksAhead === w
                              ? "bg-foreground text-background border-foreground"
                              : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          {w}w
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Day rows */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">weekly availability</label>
                    {DAY_LABELS.map((label, dayIdx) => {
                      const cfg = weeklyConfig[dayIdx];
                      return (
                        <div
                          key={dayIdx}
                          className={`flex items-center gap-2 px-3 py-2 border transition-colors ${
                            cfg.free ? "border-accent/40 bg-accent/5" : "border-border"
                          }`}
                        >
                          {/* Day toggle button */}
                          <button
                            type="button"
                            onClick={() => toggleDay(dayIdx)}
                            className={`shrink-0 w-10 py-1 font-mono text-[9px] uppercase tracking-widest border transition-colors ${
                              cfg.free
                                ? "bg-accent text-accent-foreground border-accent"
                                : "border-border text-muted-foreground hover:border-foreground/40"
                            }`}
                          >
                            {label}
                          </button>

                          {/* Status label */}
                          <span className={`font-mono text-[9px] uppercase tracking-widest w-12 shrink-0 ${cfg.free ? "text-accent" : "text-muted-foreground/50"}`}>
                            {cfg.free ? "free" : "no free"}
                          </span>

                          {/* Time inputs — only when free */}
                          {cfg.free ? (
                            <div className="flex items-center gap-1 ml-auto">
                              <input
                                type="time"
                                value={cfg.startTime}
                                onChange={(e) => updateDayTime(dayIdx, "startTime", e.target.value)}
                                className="bg-background border border-border px-1.5 py-1 font-mono text-[10px] text-foreground w-[5.5rem] focus:outline-none focus:border-foreground transition-colors"
                              />
                              <span className="font-mono text-[10px] text-muted-foreground">→</span>
                              <input
                                type="time"
                                value={cfg.endTime}
                                onChange={(e) => updateDayTime(dayIdx, "endTime", e.target.value)}
                                className="bg-background border border-border px-1.5 py-1 font-mono text-[10px] text-foreground w-[5.5rem] focus:outline-none focus:border-foreground transition-colors"
                              />
                            </div>
                          ) : (
                            <span className="font-mono text-[9px] text-muted-foreground/30 ml-auto">—</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {slotError && <p className="font-mono text-xs text-destructive">{slotError}</p>}

                  <button
                    type="button"
                    onClick={handleGeneratePrebuild}
                    disabled={generating || weeklyConfig.every((d) => !d.free)}
                    className="w-full py-2.5 bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:bg-foreground/90 border-2 border-foreground transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {generating ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <Calendar className="h-3.5 w-3.5" />}
                    generate {weeksAhead} week{weeksAhead > 1 ? "s" : ""} of slots
                  </button>
                </div>
              )}
            </div>

            {/* Slot list */}
            <div className="border-2 border-border">
              <div className="border-b-2 border-border bg-muted px-4 py-2 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">upcoming slots</span>
                <span className="font-mono text-[10px] text-accent">{slots.length} total</span>
              </div>
              <div className="max-h-[32rem] overflow-y-auto">
                {loadingSlots ? (
                  <div className="flex items-center gap-2 py-8 justify-center font-mono text-xs text-muted-foreground">
                    <Loader2 className="animate-spin h-3.5 w-3.5" />loading…
                  </div>
                ) : slots.length === 0 ? (
                  <p className="font-mono text-xs text-muted-foreground p-4">→ no slots yet</p>
                ) : (
                  slots.map((slot, idx) => (
                    <div
                      key={slot._id}
                      className={`flex items-center justify-between px-4 py-3 ${idx < slots.length - 1 ? "border-b border-border" : ""}`}
                    >
                      <div>
                        <p className="font-mono text-xs font-bold text-foreground">
                          {format(new Date(slot.date + "T00:00:00"), "MMM d, yyyy")}
                        </p>
                        <p className="font-mono text-[10px] text-muted-foreground">
                          {slot.startTime} – {slot.endTime}
                          {slot.booked && <span className="ml-2 text-accent">· booked</span>}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteSlot(slot._id)}
                        className="p-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
