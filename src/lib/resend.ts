import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function getFrom() {
  return process.env.RESEND_FROM_EMAIL as string;
}

function formatDateTime(date: string, startTime: string, endTime: string) {
  const d = new Date(`${date}T${startTime}:00`);
  const dateStr = d.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  });
  return `${dateStr}, ${startTime} – ${endTime} IST`;
}

export async function sendRequestConfirmationToVisitor(params: {
  toEmail: string;
  toName: string;
  date: string;
  startTime: string;
  endTime: string;
}) {
  const { toEmail, toName, date, startTime, endTime } = params;
  const slot = formatDateTime(date, startTime, endTime);

  await getResend().emails.send({
    from: getFrom(),
    to: toEmail,
    subject: "Your call request has been received — Saswat Barai",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;color:#1a1a1a">
        <h2 style="color:#6d28d9">Hey ${toName}! 👋</h2>
        <p>Thanks for reaching out. I've received your request to schedule a call.</p>
        <p><strong>Requested slot:</strong><br/>${slot}</p>
        <p>I'll review it and get back to you shortly. If approved, you'll receive a Google Meet link directly in your inbox.</p>
        <p style="margin-top:32px;color:#6b7280;font-size:13px">— Saswat Barai · Portfolio</p>
      </div>
    `,
  });
}

export async function sendNewRequestToAdmin(params: {
  fromName: string;
  fromEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  message?: string;
  dashboardUrl: string;
}) {
  const { fromName, fromEmail, date, startTime, endTime, message, dashboardUrl } = params;
  const slot = formatDateTime(date, startTime, endTime);

  await getResend().emails.send({
    from: getFrom(),
    to: process.env.YOUR_EMAIL as string,
    subject: `New call request from ${fromName}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;color:#1a1a1a">
        <h2 style="color:#6d28d9">New call request 📅</h2>
        <p><strong>Name:</strong> ${fromName}</p>
        <p><strong>Email:</strong> ${fromEmail}</p>
        <p><strong>Slot:</strong> ${slot}</p>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
        <a href="${dashboardUrl}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#6d28d9;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
          Open Dashboard
        </a>
      </div>
    `,
  });
}

export async function sendApprovalEmail(params: {
  toEmail: string;
  toName: string;
  date: string;
  startTime: string;
  endTime: string;
  meetLink: string;
}) {
  const { toEmail, toName, date, startTime, endTime, meetLink } = params;
  const slot = formatDateTime(date, startTime, endTime);

  await getResend().emails.send({
    from: getFrom(),
    to: toEmail,
    subject: "Your call is confirmed! Here's the Google Meet link 🎉",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;color:#1a1a1a">
        <h2 style="color:#6d28d9">Your call is confirmed, ${toName}!</h2>
        <p>I'm looking forward to speaking with you.</p>
        <p><strong>Date & Time:</strong><br/>${slot}</p>
        <a href="${meetLink}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#059669;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
          Join Google Meet
        </a>
        <p style="margin-top:24px;font-size:13px;color:#6b7280">Or copy the link: <a href="${meetLink}">${meetLink}</a></p>
        <p style="margin-top:32px;color:#6b7280;font-size:13px">— Saswat Barai · Portfolio</p>
      </div>
    `,
  });
}

export async function sendRejectionEmail(params: {
  toEmail: string;
  toName: string;
  date: string;
  startTime: string;
  endTime: string;
}) {
  const { toEmail, toName, date, startTime, endTime } = params;
  const slot = formatDateTime(date, startTime, endTime);

  await getResend().emails.send({
    from: getFrom(),
    to: toEmail,
    subject: "Update on your call request — Saswat Barai",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;color:#1a1a1a">
        <h2 style="color:#6d28d9">Hey ${toName},</h2>
        <p>Unfortunately I'm unable to take the call at the requested slot:</p>
        <p><strong>${slot}</strong></p>
        <p>Please feel free to visit my portfolio again and pick another available time — I'd love to connect!</p>
        <p style="margin-top:32px;color:#6b7280;font-size:13px">— Saswat Barai · Portfolio</p>
      </div>
    `,
  });
}
