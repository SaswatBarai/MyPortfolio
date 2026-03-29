"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Ticket {
  _id: string;
  viewerName: string;
  viewerEmail: string;
  reason: string;
  preferredDate: string;
  preferredTime: string;
  requestedDuration: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  confirmed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [cancelling, setCancelling] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (dateFilter) params.set("date", dateFilter);

    const res = await fetch(`/api/tickets?${params.toString()}`);
    const data = await res.json();
    setTickets(data.tickets ?? []);
    setLoading(false);
  }, [statusFilter, dateFilter]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  async function handleCancel(id: string) {
    if (!confirm("Cancel this ticket?")) return;
    setCancelling(id);
    try {
      const res = await fetch(`/api/tickets/${id}/cancel`, { method: "PATCH" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to cancel");
      }
      await fetchTickets();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to cancel ticket");
    } finally {
      setCancelling(null);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">All Tickets</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <Button variant="outline" size="sm" onClick={() => { setStatusFilter(""); setDateFilter(""); }}>
          Clear
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : tickets.length === 0 ? (
        <p className="text-muted-foreground">No tickets found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">Name</th>
                <th className="pb-3 pr-4 font-medium">Date / Time</th>
                <th className="pb-3 pr-4 font-medium">Duration</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/dashboard/tickets/${ticket._id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {ticket.viewerName}
                    </Link>
                    <p className="text-xs text-muted-foreground">{ticket.viewerEmail}</p>
                  </td>
                  <td className="py-3 pr-4">
                    {format(new Date(ticket.preferredDate), "MMM d, yyyy")}
                    <br />
                    <span className="text-muted-foreground">{ticket.preferredTime}</span>
                  </td>
                  <td className="py-3 pr-4">{ticket.requestedDuration} min</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                        STATUS_COLORS[ticket.status]
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/dashboard/tickets/${ticket._id}`}>View</Link>
                      </Button>
                      {(ticket.status === "pending" || ticket.status === "confirmed") && (
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={cancelling === ticket._id}
                          onClick={() => handleCancel(ticket._id)}
                        >
                          {cancelling === ticket._id ? "…" : "Cancel"}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
