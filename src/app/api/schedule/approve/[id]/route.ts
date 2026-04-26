import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ScheduleRequest from "@/lib/models/ScheduleRequest";
import { createMeetingEvent } from "@/lib/google-calendar";
import { sendApprovalEmail } from "@/lib/resend";

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

    const { meetLink, eventId } = await createMeetingEvent({
      summary: `Call with ${scheduleRequest.name}`,
      description: scheduleRequest.message
        ? `Message from ${scheduleRequest.name}: ${scheduleRequest.message}`
        : `Scheduled call with ${scheduleRequest.name} (${scheduleRequest.email})`,
      date: scheduleRequest.date,
      startTime: scheduleRequest.startTime,
      endTime: scheduleRequest.endTime,
      attendeeEmail: scheduleRequest.email,
      attendeeName: scheduleRequest.name,
    });

    scheduleRequest.status = "approved";
    scheduleRequest.meetLink = meetLink;
    scheduleRequest.googleEventId = eventId;
    await scheduleRequest.save();

    await sendApprovalEmail({
      toEmail: scheduleRequest.email,
      toName: scheduleRequest.name,
      date: scheduleRequest.date,
      startTime: scheduleRequest.startTime,
      endTime: scheduleRequest.endTime,
      meetLink,
    });

    return NextResponse.json({ success: true, meetLink });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
