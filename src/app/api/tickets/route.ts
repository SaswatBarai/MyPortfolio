import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Ticket from "@/lib/models/Ticket";
import { auth } from "@/lib/auth";
import { sendOwnerNotification } from "@/lib/email";

// GET /api/tickets — owner only, with optional status/date filters
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get("status");
  const dateFilter = searchParams.get("date");

  type TicketQuery = {
    status?: string;
    preferredDate?: { $gte: Date; $lt: Date };
  };
  const query: TicketQuery = {};
  if (statusFilter) query.status = statusFilter;
  if (dateFilter) {
    const d = new Date(dateFilter);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    query.preferredDate = { $gte: d, $lt: next };
  }

  const tickets = await Ticket.find(query).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ tickets });
}

// POST /api/tickets — public (viewer submits a request)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { viewerName, viewerEmail, reason, preferredDate, preferredTime, requestedDuration } =
      body;

    if (!viewerName || !viewerEmail || !reason || !preferredDate || !preferredTime || !requestedDuration) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const ticket = await Ticket.create({
      viewerName,
      viewerEmail,
      reason,
      preferredDate: new Date(preferredDate),
      preferredTime,
      requestedDuration: Number(requestedDuration),
      status: "pending",
    });

    // Send email notification to owner (best-effort)
    try {
      await sendOwnerNotification(ticket);
    } catch (emailErr) {
      console.warn("[tickets POST] email notification failed:", emailErr);
    }

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (err) {
    console.error("[tickets POST] error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
