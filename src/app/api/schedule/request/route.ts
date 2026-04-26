import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import AvailableSlot from "@/lib/models/AvailableSlot";
import ScheduleRequest from "@/lib/models/ScheduleRequest";
import {
  sendRequestConfirmationToVisitor,
  sendNewRequestToAdmin,
} from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, email, slotId, message } = body;

    if (!name || !email || !slotId) {
      return NextResponse.json({ error: "name, email and slotId are required" }, { status: 400 });
    }

    const slot = await AvailableSlot.findById(slotId);
    if (!slot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }
    if (slot.booked) {
      return NextResponse.json({ error: "This slot is already booked" }, { status: 409 });
    }

    // Mark slot as booked to prevent double-booking
    slot.booked = true;
    await slot.save();

    const scheduleRequest = await ScheduleRequest.create({
      name,
      email,
      slotId: slot._id,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      message: message ?? "",
    });

    const origin = request.headers.get("origin") ?? "";
    const dashboardUrl = `${origin}/dashboard`;

    // Fire emails in parallel — don't let email failure block the response
    await Promise.allSettled([
      sendRequestConfirmationToVisitor({
        toEmail: email,
        toName: name,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
      }),
      sendNewRequestToAdmin({
        fromName: name,
        fromEmail: email,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        message,
        dashboardUrl,
      }),
    ]);

    return NextResponse.json({ success: true, requestId: scheduleRequest._id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
