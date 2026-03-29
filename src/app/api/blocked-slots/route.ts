import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BlockedSlot from "@/lib/models/BlockedSlot";
import { auth } from "@/lib/auth";

// GET /api/blocked-slots — public (used by availability)
export async function GET() {
  await connectDB();
  const slots = await BlockedSlot.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ slots });
}

// POST /api/blocked-slots — owner only
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();
  const { type, date, startTime, endTime, recurrence, reason } = body;

  if (!type || !["full_day", "time_range"].includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const slot = await BlockedSlot.create({
    type,
    date: date ? new Date(date) : undefined,
    startTime,
    endTime,
    recurrence: recurrence ?? "none",
    reason,
  });

  return NextResponse.json({ slot }, { status: 201 });
}
