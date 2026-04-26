import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ScheduleRequest from "@/lib/models/ScheduleRequest";
import AvailableSlot from "@/lib/models/AvailableSlot";
import { sendRejectionEmail } from "@/lib/resend";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const scheduleRequest = await ScheduleRequest.findById(id);
    if (!scheduleRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }
    if (scheduleRequest.status !== "pending") {
      return NextResponse.json({ error: "Request is no longer pending" }, { status: 409 });
    }

    scheduleRequest.status = "rejected";
    await scheduleRequest.save();

    // Unbook the slot so others can book it
    await AvailableSlot.findByIdAndUpdate(scheduleRequest.slotId, { booked: false });

    await sendRejectionEmail({
      toEmail: scheduleRequest.email,
      toName: scheduleRequest.name,
      date: scheduleRequest.date,
      startTime: scheduleRequest.startTime,
      endTime: scheduleRequest.endTime,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
