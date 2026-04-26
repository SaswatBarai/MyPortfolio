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
  const endDateTime = `${date}T${endTime}:00`;

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
