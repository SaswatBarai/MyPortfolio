import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import AvailableSlot from "@/lib/models/AvailableSlot";
import ScheduleRequestModel from "@/lib/models/ScheduleRequest";
import {
  sendRequestConfirmationToVisitor,
  sendNewRequestToAdmin,
} from "@/lib/resend";

function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, email, slotId, message, startTime, endTime } = body;

    if (!name || !email || !slotId || !startTime || !endTime) {
      return NextResponse.json(
        { error: "name, email, slotId, startTime and endTime are required" },
        { status: 400 }
      );
    }

    const slot = await AvailableSlot.findById(slotId);
    if (!slot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }
    if (slot.booked) {
      return NextResponse.json({ error: "This slot is no longer available" }, { status: 409 });
    }

    let reqStart = toMinutes(startTime);
    let reqEnd   = toMinutes(endTime);
    const winStart = toMinutes(slot.startTime);
    let winEnd   = toMinutes(slot.endTime);

    const overnight = winEnd <= winStart;
    if (overnight) {
      winEnd += 1440;
      if (reqStart < winStart) reqStart += 1440;
      if (reqEnd <= winStart)  reqEnd   += 1440;
    }

    if (reqStart < winStart || reqEnd > winEnd) {
      return NextResponse.json(
        { error: `Requested time must be within ${slot.startTime}–${slot.endTime}` },
        { status: 400 }
      );
    }
    // Enforce exactly 60-minute duration
    const duration = reqEnd - reqStart;
    if (duration !== 60) {
      return NextResponse.json(
        { error: "Meeting must be exactly 60 minutes" },
        { status: 400 }
      );
    }

    // Check for conflicts with approved meetings only (pending are tentative)
    const existing = await ScheduleRequestModel.find({
      date: slot.date,
      status: "approved",
    }).select("startTime endTime");

    for (const req of existing) {
      let exStart = toMinutes(req.startTime);
      let exEnd   = toMinutes(req.endTime);
      if (overnight) {
        if (exStart < winStart) exStart += 1440;
        if (exEnd   <= winStart) exEnd  += 1440;
      }
      if (reqStart < exEnd && exStart < reqEnd) {
        return NextResponse.json(
          { error: `This time overlaps with a confirmed meeting (${req.startTime}–${req.endTime}). Please pick a different time.` },
          { status: 409 }
        );
      }
    }

    // Limit each email to 2 requests per day (active requests only)
    const existingForEmailOnDate = await ScheduleRequestModel.countDocuments({
      date: slot.date,
      email: email.toLowerCase(),
      status: { $in: ["pending", "approved"] },
    });
    if (existingForEmailOnDate >= 2) {
      return NextResponse.json(
        { error: "You can schedule at most 2 calls per day with the same email." },
        { status: 409 }
      );
    }

    const scheduleRequest = await ScheduleRequestModel.create({
      name,
      email: email.toLowerCase(),
      slotId: slot._id,
      date: slot.date,
      startTime,
      endTime,
      message: message ?? "",
    });

    const origin = request.headers.get("origin") ?? "";
    const dashboardUrl = `${origin}/dashboard`;

    await Promise.allSettled([
      sendRequestConfirmationToVisitor({
        toEmail: email,
        toName: name,
        date: slot.date,
        startTime,
        endTime,
      }),
      sendNewRequestToAdmin({
        fromName: name,
        fromEmail: email,
        date: slot.date,
        startTime,
        endTime,
        message,
        dashboardUrl,
      }),
    ]);

    return NextResponse.json(
      { success: true, requestId: scheduleRequest._id },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
