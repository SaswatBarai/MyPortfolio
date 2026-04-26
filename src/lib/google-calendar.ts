import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

export interface CalendarEventResult {
  meetLink: string;
  eventId: string;
  htmlLink: string;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export async function createMeetingEvent(params: {
  summary: string;
  description: string;
  date: string;      // "YYYY-MM-DD"
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  attendeeEmail: string;
  attendeeName: string;
}): Promise<CalendarEventResult> {
  const { summary, description, date, startTime, endTime, attendeeEmail, attendeeName } = params;

  const startDateTime = `${date}T${startTime}:00`;
  // If end is before start in minutes, the meeting crosses midnight → end is next day
  const endDate = timeToMinutes(endTime) < timeToMinutes(startTime) ? addDays(date, 1) : date;
  const endDateTime = `${endDate}T${endTime}:00`;

  const event = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    conferenceDataVersion: 1,
    sendUpdates: "all",
    requestBody: {
      summary,
      description,
      start: {
        dateTime: startDateTime,
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endDateTime,
        timeZone: "Asia/Kolkata",
      },
      attendees: [
        { email: process.env.YOUR_EMAIL as string, displayName: "Saswat Barai" },
        { email: attendeeEmail, displayName: attendeeName },
      ],
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    },
  });

  const meetLink =
    event.data.conferenceData?.entryPoints?.find((ep) => ep.entryPointType === "video")?.uri ?? "";

  return {
    meetLink,
    eventId: event.data.id ?? "",
    htmlLink: event.data.htmlLink ?? "",
  };
}
