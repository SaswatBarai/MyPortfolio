import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Ticket from "@/lib/models/Ticket";

// GET /api/tickets/viewer?email=xxx — public, viewer looks up their own tickets
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  await connectDB();

  const tickets = await Ticket.find({ viewerEmail: email.toLowerCase() })
    .sort({ preferredDate: -1 })
    .lean();

  return NextResponse.json({ tickets });
}
