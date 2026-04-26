import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import AvailableSlot from "@/lib/models/AvailableSlot";
import ScheduleRequestModel from "@/lib/models/ScheduleRequest";

// GET /api/schedule/slots?date=YYYY-MM-DD
// When date is given: returns available windows + already-booked ranges for that date
// Without date:       returns all unbooked future slots (admin view)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (date) {
      const slots = await AvailableSlot.find({ date, booked: false })
        .sort({ startTime: 1 })
        .lean();

      // Return booked time ranges so the client can show / avoid them
      const booked = await ScheduleRequestModel.find({
        date,
        status: { $in: ["pending", "approved"] },
      })
        .select("startTime endTime status")
        .lean();

      return NextResponse.json({
        slots,
        bookedRanges: booked.map((r) => ({
          startTime: r.startTime,
          endTime: r.endTime,
          status: r.status,
        })),
      });
    }

    // Admin: all unbooked future slots
    const today = new Date().toISOString().slice(0, 10);
    const slots = await AvailableSlot.find({ booked: false, date: { $gte: today } })
      .sort({ date: 1, startTime: 1 })
      .lean();
    return NextResponse.json({ slots });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/schedule/slots — admin adds a new available slot (manual or prebuild)
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { date, startTime, endTime, mode } = body;

    if (mode === "weekly") {
      const { startDate, endDate, weekdays } = body as {
        startDate?: string;
        endDate?: string;
        weekdays?: number[];
      };

      if (
        !startDate ||
        !endDate ||
        !startTime ||
        !endTime ||
        !Array.isArray(weekdays) ||
        weekdays.length === 0
      ) {
        return NextResponse.json(
          { error: "startDate, endDate, weekdays, startTime and endTime are required" },
          { status: 400 }
        );
      }

      const start = new Date(`${startDate}T00:00:00`);
      const end = new Date(`${endDate}T00:00:00`);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
        return NextResponse.json({ error: "Invalid date range" }, { status: 400 });
      }

      const normalizedWeekdays = new Set(weekdays.map((d) => Number(d)));
      const docs: { date: string; startTime: string; endTime: string }[] = [];
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        if (!normalizedWeekdays.has(d.getDay())) continue;
        docs.push({ date: d.toISOString().slice(0, 10), startTime, endTime });
      }

      if (docs.length === 0) {
        return NextResponse.json({ createdCount: 0, skippedCount: 0 });
      }

      let createdCount = 0;
      let skippedCount = 0;
      for (const doc of docs) {
        try {
          await AvailableSlot.create(doc);
          createdCount += 1;
        } catch (err: unknown) {
          if ((err as { code?: number }).code === 11000) { skippedCount += 1; continue; }
          throw err;
        }
      }

      return NextResponse.json({ createdCount, skippedCount }, { status: 201 });
    }

    if (!date || !startTime || !endTime) {
      return NextResponse.json(
        { error: "date, startTime and endTime are required" },
        { status: 400 }
      );
    }

    const slot = await AvailableSlot.create({ date, startTime, endTime });
    return NextResponse.json({ slot }, { status: 201 });
  } catch (err: unknown) {
    if ((err as { code?: number }).code === 11000) {
      return NextResponse.json({ error: "Slot already exists" }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/schedule/slots?id=...
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
