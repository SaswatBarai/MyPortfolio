import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import AvailableSlot from "@/lib/models/AvailableSlot";

// GET /api/schedule/slots?date=YYYY-MM-DD  — returns free slots for a date (or all future)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    const query: Record<string, unknown> = { booked: false };
    if (date) {
      query.date = date;
    } else {
      // Return all unbooked future slots
      const today = new Date().toISOString().slice(0, 10);
      query.date = { $gte: today };
    }

    const slots = await AvailableSlot.find(query).sort({ date: 1, startTime: 1 }).lean();
    return NextResponse.json({ slots });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/schedule/slots — admin adds a new available slot
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { date, startTime, endTime } = body;

    if (!date || !startTime || !endTime) {
      return NextResponse.json({ error: "date, startTime and endTime are required" }, { status: 400 });
    }

    const slot = await AvailableSlot.create({ date, startTime, endTime });
    return NextResponse.json({ slot }, { status: 201 });
  } catch (err: unknown) {
    const error = err as { code?: number };
    if (error.code === 11000) {
      return NextResponse.json({ error: "Slot already exists" }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/schedule/slots?id=... — admin deletes a slot
export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    await AvailableSlot.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
