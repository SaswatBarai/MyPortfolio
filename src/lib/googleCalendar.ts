import { google } from "googleapis";
import { ITicket } from "./models/Ticket";

function getAuth() {
  const credentials = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL!,
    private_key: (process.env.GOOGLE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),
  };

  return new google.auth.JWT(credentials.client_email, undefined, credentials.private_key, [
    "https://www.googleapis.com/auth/calendar",
  ]);
}

export async function createCalendarEvent(ticket: ITicket): Promise<{ eventId: string; meetLink: string }> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID!;
  const auth = getAuth();
  const calendar = google.calendar({ version: "v3", auth });

  const duration = ticket.confirmedDuration ?? ticket.requestedDuration;

  // Build start datetime
  const datePart = ticket.preferredDate.toISOString().split("T")[0];
  const startDateTime = new Date(`${datePart}T${ticket.preferredTime}:00`);
  const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 1000);

  const ownerEmail = process.env.OWNER_EMAIL!;

  const event = await calendar.events.insert({
    calendarId,
    conferenceDataVersion: 1,
    requestBody: {
      summary: `Call with ${ticket.viewerName} — Portfolio`,
      description: ticket.reason,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: "UTC",
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: "UTC",
      },
      attendees: [{ email: ownerEmail }, { email: ticket.viewerEmail }],
      conferenceData: {
        createRequest: {
          requestId: (ticket._id as string).toString(),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    },
  });

  const eventId = event.data.id ?? "";
  const meetLink =
    event.data.hangoutLink ??
    event.data.conferenceData?.entryPoints?.[0]?.uri ??
    "";

  return { eventId, meetLink };
}

export async function deleteCalendarEvent(googleEventId: string): Promise<void> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID!;
  const auth = getAuth();
  const calendar = google.calendar({ version: "v3", auth });

  await calendar.events.delete({ calendarId, eventId: googleEventId });
}
