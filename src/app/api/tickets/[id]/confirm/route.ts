import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Ticket from "@/lib/models/Ticket";
import { auth } from "@/lib/auth";
import { createCalendarEvent } from "@/lib/googleCalendar";
import { sendViewerConfirmation } from "@/lib/email";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const { id } = await params;
  const body = await req.json();
  const { confirmedDuration } = body;

  const ticket = await Ticket.findById(id);
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  if (ticket.status !== "pending") {
    return NextResponse.json(
      { error: "Only pending tickets can be confirmed" },
      { status: 400 }
    );
  }

  ticket.confirmedDuration = confirmedDuration ?? ticket.requestedDuration;
  ticket.status = "confirmed";

  // Create Google Calendar event (best-effort)
  try {
    const { eventId, meetLink } = await createCalendarEvent(ticket);
    ticket.googleEventId = eventId;
    ticket.meetLink = meetLink;
  } catch (calErr) {
    console.warn("[confirm] Google Calendar event creation failed:", calErr);
  }

  await ticket.save();

  // Email the viewer (best-effort)
  try {
    await sendViewerConfirmation(ticket);
  } catch (emailErr) {
    console.warn("[confirm] email failed:", emailErr);
  }

  return NextResponse.json({ ticket });
}
