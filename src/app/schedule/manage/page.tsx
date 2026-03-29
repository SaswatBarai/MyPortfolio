"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  confirmedDuration?: number;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  confirmed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
};

export default function ManagePage() {
  const [email, setEmail] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSearched(false);

    try {
      // Viewer-side lookup: we'll search for tickets matching the email
      // via a public query param endpoint
      const res = await fetch(
        `/api/tickets/viewer?email=${encodeURIComponent(email)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to fetch tickets");
      setTickets(data.tickets);
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(ticketId: string) {
    setCancellingId(ticketId);
    try {
      const res = await fetch(`/api/tickets/${ticketId}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ viewerEmail: email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to cancel");
      setTickets((prev) =>
        prev.map((t) =>
          t._id === ticketId ? { ...t, status: "cancelled" } : t
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to cancel");
    } finally {
      setCancellingId(null);
    }
  }

  const upcoming = tickets.filter(
    (t) => t.status !== "cancelled" && new Date(t.preferredDate) >= new Date()
  );
  const past = tickets.filter(
    (t) => t.status === "cancelled" || new Date(t.preferredDate) < new Date()
  );

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <Link
          href="/schedule"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </Link>

        <div>
          <h1 className="text-2xl font-bold">Manage Your Bookings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your email to look up your scheduled calls.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Searching…" : "Look Up"}
          </Button>
        </form>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {searched && tickets.length === 0 && (
          <p className="text-muted-foreground">No bookings found for this email.</p>
        )}

        {upcoming.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Upcoming Calls</h2>
            {upcoming.map((ticket) => (
              <TicketCard
                key={ticket._id}
                ticket={ticket}
                onCancel={handleCancel}
                cancellingId={cancellingId}
              />
            ))}
          </section>
        )}

        {past.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-muted-foreground">Past Calls</h2>
            {past.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

function TicketCard({
  ticket,
  onCancel,
  cancellingId,
}: {
  ticket: Ticket;
  onCancel?: (id: string) => void;
  cancellingId?: string | null;
}) {
  const canCancel =
    onCancel &&
    (ticket.status === "pending" || ticket.status === "confirmed") &&
    new Date(ticket.preferredDate) > new Date();

  return (
    <div className="border rounded-xl p-5 space-y-3 bg-card">
      <div className="flex items-center justify-between">
        <p className="font-medium">
          {format(new Date(ticket.preferredDate), "EEEE, MMMM d, yyyy")} at{" "}
          {ticket.preferredTime}
        </p>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
            STATUS_COLORS[ticket.status]
          }`}
        >
          {ticket.status}
        </span>
      </div>

      <p className="text-sm text-muted-foreground">
        Duration: {ticket.confirmedDuration ?? ticket.requestedDuration} min
      </p>
      <p className="text-sm">
        <span className="font-medium">Reason:</span> {ticket.reason}
      </p>

      {ticket.meetLink && (
        <p className="text-sm">
          <span className="font-medium">Meet Link: </span>
          <a
            href={ticket.meetLink}
            target="_blank"
            rel="noreferrer"
            className="text-primary underline underline-offset-2"
          >
            Join call
          </a>
        </p>
      )}

      {canCancel && (
        <Button
          variant="destructive"
          size="sm"
          disabled={cancellingId === ticket._id}
          onClick={() => onCancel?.(ticket._id)}
        >
          {cancellingId === ticket._id ? "Cancelling…" : "Cancel Call"}
        </Button>
      )}
    </div>
  );
}
