"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  CheckCircle2, XCircle, Clock, Loader2, LogOut,
  Plus, Trash2, ExternalLink, Calendar, Mail, User,
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

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "border-border text-muted-foreground bg-muted",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    className: "border-transparent text-green-400 bg-green-500/10",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "border-transparent text-red-400 bg-red-500/10",
  },
};

export default function DashboardPage() {
  const router = useRouter();

  const [requests, setRequests] = useState<ScheduleRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [newSlot, setNewSlot] = useState({ date: "", startTime: "", endTime: "" });
  const [addingSlot, setAddingSlot] = useState(false);
  const [slotError, setSlotError] = useState("");

  const fetchRequests = useCallback(async () => {
    setLoadingRequests(true);
    try {
      const res = await fetch("/api/schedule/requests");
      if (res.status === 401) { router.push("/dashboard/login"); return; }
      const data = await res.json();
      setRequests(data.requests ?? []);
    } finally {
      setLoadingRequests(false);
    }
  }, [router]);

  const fetchSlots = useCallback(async () => {
    setLoadingSlots(true);
    try {
      const res = await fetch("/api/schedule/slots");
      const data = await res.json();
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
    } finally {
      setActionLoading(null);
    }
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
    } finally {
      setActionLoading(null);
    }
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
    } finally {
      setAddingSlot(false);
    }
  }

  async function handleDeleteSlot(id: string) {
    if (!confirm("Delete this slot?")) return;
    await fetch(`/api/schedule/slots?id=${id}`, { method: "DELETE" });
    await fetchSlots();
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/dashboard/login");
  }

  const pending = requests.filter((r) => r.status === "pending");
  const approved = requests.filter((r) => r.status === "approved");
  const rejected = requests.filter((r) => r.status === "rejected");

  function formatSlot(date: string, start: string, end: string) {
    return `${format(new Date(date + "T00:00:00"), "MMM d, yyyy")} · ${start}–${end}`;
  }

  function RequestCard({ req }: { req: ScheduleRequest }) {
    const cfg = statusConfig[req.status];
    const StatusIcon = cfg.icon;
    return (
      <Card className="border-border bg-card hover:shadow-md transition-shadow">
        <CardContent className="pt-5 pb-4 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="font-semibold text-sm text-foreground truncate">{req.name}</span>
            </div>
            <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${cfg.className}`}>
              <StatusIcon className="h-3 w-3" />
              {cfg.label}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            <a href={`mailto:${req.email}`} className="hover:text-foreground transition-colors truncate">
              {req.email}
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>{formatSlot(req.date, req.startTime, req.endTime)}</span>
          </div>

          {req.message && (
            <p className="text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2 italic border border-border/50">
              "{req.message}"
            </p>
          )}

          {req.status === "approved" && req.meetLink && (
            <a
              href={req.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-foreground hover:text-muted-foreground transition-colors font-medium"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open Meet link
            </a>
          )}

          {req.status === "pending" && (
            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                onClick={() => handleApprove(req._id)}
                disabled={!!actionLoading}
                className="bg-foreground text-background hover:bg-foreground/90 flex-1 text-xs h-8"
              >
                {actionLoading === req._id + "-approve" ? (
                  <Loader2 className="animate-spin h-3.5 w-3.5" />
                ) : (
                  <><CheckCircle2 className="h-3.5 w-3.5 mr-1" />Approve</>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleReject(req._id)}
                disabled={!!actionLoading}
                className="border-border text-muted-foreground hover:text-foreground hover:bg-muted flex-1 text-xs h-8"
              >
                {actionLoading === req._id + "-reject" ? (
                  <Loader2 className="animate-spin h-3.5 w-3.5" />
                ) : (
                  <><XCircle className="h-3.5 w-3.5 mr-1" />Reject</>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  function EmptyState({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Icon className="h-8 w-8 mx-auto mb-3 opacity-20" />
        <p className="text-sm">{label}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar — matches portfolio navbar style */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Portfolio</p>
            <h1 className="text-sm font-semibold text-foreground">Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Pending", count: pending.length, color: "text-muted-foreground" },
            { label: "Approved", count: approved.length, color: "text-green-400" },
            { label: "Rejected", count: rejected.length, color: "text-red-400" },
          ].map((stat) => (
            <Card key={stat.label} className="border-border bg-card">
              <CardContent className="pt-5 pb-4 text-center">
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.count}</p>
                <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="pending">
          <TabsList className="mb-6 bg-muted/50 border border-border">
            <TabsTrigger value="pending" className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground">
              Pending
              {pending.length > 0 && (
                <Badge className="ml-1.5 bg-foreground text-background text-[10px] px-1.5 py-0 h-4">
                  {pending.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved" className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground">Approved</TabsTrigger>
            <TabsTrigger value="rejected" className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground">Rejected</TabsTrigger>
            <TabsTrigger value="slots" className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground">Manage Slots</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {loadingRequests
              ? <div className="flex items-center justify-center py-16 text-muted-foreground text-sm gap-2"><Loader2 className="animate-spin h-4 w-4" />Loading…</div>
              : pending.length === 0
                ? <EmptyState icon={Clock} label="No pending requests" />
                : <div className="grid gap-3 sm:grid-cols-2">{pending.map((req) => <RequestCard key={req._id} req={req} />)}</div>
            }
          </TabsContent>

          <TabsContent value="approved">
            {loadingRequests
              ? <div className="flex items-center justify-center py-16 text-muted-foreground text-sm gap-2"><Loader2 className="animate-spin h-4 w-4" />Loading…</div>
              : approved.length === 0
                ? <EmptyState icon={CheckCircle2} label="No approved calls yet" />
                : <div className="grid gap-3 sm:grid-cols-2">{approved.map((req) => <RequestCard key={req._id} req={req} />)}</div>
            }
          </TabsContent>

          <TabsContent value="rejected">
            {loadingRequests
              ? <div className="flex items-center justify-center py-16 text-muted-foreground text-sm gap-2"><Loader2 className="animate-spin h-4 w-4" />Loading…</div>
              : rejected.length === 0
                ? <EmptyState icon={XCircle} label="No rejected requests" />
                : <div className="grid gap-3 sm:grid-cols-2">{rejected.map((req) => <RequestCard key={req._id} req={req} />)}</div>
            }
          </TabsContent>

          <TabsContent value="slots">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Add slot */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Plus className="h-3.5 w-3.5" />
                    Add Available Slot
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Add a time slot when you&apos;re free for a call.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddSlot} className="flex flex-col gap-4">
                    <div className="grid gap-1.5">
                      <Label htmlFor="slot-date" className="text-xs text-muted-foreground uppercase tracking-wide">
                        Date
                      </Label>
                      <Input
                        id="slot-date"
                        type="date"
                        value={newSlot.date}
                        onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                        min={new Date().toISOString().slice(0, 10)}
                        required
                        className="bg-background border-border text-foreground text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-1.5">
                        <Label htmlFor="slot-start" className="text-xs text-muted-foreground uppercase tracking-wide">
                          Start
                        </Label>
                        <Input
                          id="slot-start"
                          type="time"
                          value={newSlot.startTime}
                          onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                          required
                          className="bg-background border-border text-foreground text-sm"
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="slot-end" className="text-xs text-muted-foreground uppercase tracking-wide">
                          End
                        </Label>
                        <Input
                          id="slot-end"
                          type="time"
                          value={newSlot.endTime}
                          onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                          required
                          className="bg-background border-border text-foreground text-sm"
                        />
                      </div>
                    </div>
                    {slotError && <p className="text-xs text-destructive">{slotError}</p>}
                    <Button
                      type="submit"
                      disabled={addingSlot}
                      className="bg-foreground text-background hover:bg-foreground/90 text-sm"
                    >
                      {addingSlot
                        ? <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        : <Plus className="h-4 w-4 mr-2" />
                      }
                      Add Slot
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Existing slots */}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Upcoming Slots
                </p>
                {loadingSlots ? (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
                    <Loader2 className="animate-spin h-4 w-4" />Loading…
                  </div>
                ) : slots.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-4">No upcoming slots. Add one.</p>
                ) : (
                  <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
                    {slots.map((slot) => (
                      <div
                        key={slot._id}
                        className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="text-foreground font-medium text-xs">
                              {format(new Date(slot.date + "T00:00:00"), "MMM d, yyyy")}
                            </span>
                            <span className="text-muted-foreground text-xs ml-2">
                              {slot.startTime}–{slot.endTime}
                            </span>
                          </div>
                          {slot.booked && (
                            <span className="text-[10px] text-muted-foreground border border-border rounded-full px-2 py-0.5">
                              booked
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteSlot(slot._id)}
                          className="text-muted-foreground hover:text-foreground transition-colors p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
