import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Ticket from "@/lib/models/Ticket";
import Link from "next/link";
import { redirect } from "next/navigation";

async function getStats() {
  await connectDB();
  const [pending, confirmed, cancelled, completed] = await Promise.all([
    Ticket.countDocuments({ status: "pending" }),
    Ticket.countDocuments({ status: "confirmed" }),
    Ticket.countDocuments({ status: "cancelled" }),
    Ticket.countDocuments({ status: "completed" }),
  ]);
  return { pending, confirmed, cancelled, completed };
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const stats = await getStats();

  const cards = [
    { label: "Pending", value: stats.pending, color: "text-yellow-500", href: "/dashboard/tickets?status=pending" },
    { label: "Confirmed", value: stats.confirmed, color: "text-green-500", href: "/dashboard/tickets?status=confirmed" },
    { label: "Cancelled", value: stats.cancelled, color: "text-red-500", href: "/dashboard/tickets?status=cancelled" },
    { label: "Completed", value: stats.completed, color: "text-blue-500", href: "/dashboard/tickets?status=completed" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="border rounded-xl p-6 bg-card hover:bg-muted transition-colors text-center space-y-2"
          >
            <p className={`text-4xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-sm text-muted-foreground">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Link
          href="/dashboard/tickets"
          className="border rounded-xl p-5 bg-card hover:bg-muted transition-colors"
        >
          <h2 className="font-semibold mb-1">All Tickets</h2>
          <p className="text-sm text-muted-foreground">Review, approve or cancel call requests.</p>
        </Link>
        <Link
          href="/dashboard/availability"
          className="border rounded-xl p-5 bg-card hover:bg-muted transition-colors"
        >
          <h2 className="font-semibold mb-1">Availability</h2>
          <p className="text-sm text-muted-foreground">Block dates and time ranges.</p>
        </Link>
        <Link
          href="/dashboard/settings"
          className="border rounded-xl p-5 bg-card hover:bg-muted transition-colors"
        >
          <h2 className="font-semibold mb-1">Settings</h2>
          <p className="text-sm text-muted-foreground">Working hours, durations and timezone.</p>
        </Link>
      </div>
    </div>
  );
}
