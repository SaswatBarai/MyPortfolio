"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface Ticket {
  _id: string;
  viewerName: string;
  viewerEmail: string;
  reason: string;
  preferredDate: string;
  preferredTime: string;
  requestedDuration: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  meetLink?: string;
  googleEventId?: string;
  confirmedDuration?: number;
  createdAt: string;
}

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmedDuration, setConfirmedDuration] = useState<number>(30);
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/tickets/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setTicket(d.ticket);
        if (d.ticket) setConfirmedDuration(d.ticket.requestedDuration);
        setLoading(false);
      });
  }, [id]);

  async function handleConfirm() {
    setConfirming(true);
    setError("");
    try {
      const res = await fetch(`/api/tickets/${id}/confirm`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmedDuration }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setTicket(data.ticket);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setConfirming(false);
    }
  }

  async function handleCancel() {
    if (!confirm("Cancel this ticket?")) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/tickets/${id}/cancel`, { method: "PATCH" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      router.push("/dashboard/tickets");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setCancelling(false);
    }
  }

  if (loading) return <p className="text-muted-foreground">Loading…</p>;
  if (!ticket) return <p>Ticket not found.</p>;

  return (
    <div className="max-w-xl space-y-6">
      <Link
        href="/dashboard/tickets"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> All Tickets
      </Link>

      <h1 className="text-2xl font-bold">Ticket Detail</h1>

      <div className="border rounded-xl p-6 space-y-4 bg-card">
        <Row label="Name" value={ticket.viewerName} />
        <Row label="Email" value={ticket.viewerEmail} />
        <Row
          label="Date"
          value={`${format(new Date(ticket.preferredDate), "EEEE, MMMM d, yyyy")} at ${ticket.preferredTime}`}
        />
        <Row label="Requested Duration" value={`${ticket.requestedDuration} min`} />
        <Row label="Status" value={ticket.status} />
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Reason</p>
          <p className="text-sm">{ticket.reason}</p>
        </div>
        {ticket.meetLink && (
          <Row
            label="Meet Link"
            value={
              <a
                href={ticket.meetLink}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-2"
              >
                {ticket.meetLink}
              </a>
            }
          />
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {ticket.status === "pending" && (
        <div className="space-y-4 border rounded-xl p-6 bg-card">
          <h2 className="font-semibold">Confirm & Schedule</h2>
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirmed Duration
            </label>
            <select
              value={confirmedDuration}
              onChange={(e) => setConfirmedDuration(Number(e.target.value))}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm w-full"
            >
              {[15, 30, 45, 60].map((d) => (
                <option key={d} value={d}>
                  {d} minutes
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleConfirm} disabled={confirming} className="flex-1">
              {confirming ? "Confirming…" : "Confirm & Schedule"}
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? "Cancelling…" : "Cancel"}
            </Button>
          </div>
        </div>
      )}

      {ticket.status === "confirmed" && (
        <Button
          variant="destructive"
          onClick={handleCancel}
          disabled={cancelling}
        >
          {cancelling ? "Cancelling…" : "Cancel This Call"}
        </Button>
      )}
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}
