import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Ticket from "@/lib/models/Ticket";
import { auth } from "@/lib/auth";
import { deleteCalendarEvent } from "@/lib/googleCalendar";
import { sendCancellationEmail } from "@/lib/email";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const { viewerEmail } = body; // provided by viewer to authorise their own cancellation

  const ticket = await Ticket.findById(id);
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  if (ticket.status === "cancelled") {
    return NextResponse.json({ error: "Already cancelled" }, { status: 400 });
  }

  // Determine who is cancelling: owner (has session) or viewer (matches email)
  const session = await auth();
  let cancelledBy: "owner" | "viewer";

  if (session) {
    cancelledBy = "owner";
  } else if (viewerEmail && viewerEmail === ticket.viewerEmail) {
    cancelledBy = "viewer";
  } else {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  ticket.status = "cancelled";

  // Delete Google Calendar event (best-effort)
  if (ticket.googleEventId) {
    try {
      await deleteCalendarEvent(ticket.googleEventId);
    } catch (calErr) {
      console.warn("[cancel] Google Calendar deletion failed:", calErr);
    }
  }

  await ticket.save();

  // Send cancellation email (best-effort)
  try {
    await sendCancellationEmail(ticket, cancelledBy);
  } catch (emailErr) {
    console.warn("[cancel] email failed:", emailErr);
  }

  return NextResponse.json({ ticket });
}
