import { Resend } from "resend";
import { ITicket } from "./models/Ticket";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const ownerEmail = () => process.env.OWNER_EMAIL ?? "";
const fromEmail = () => process.env.FROM_EMAIL ?? "noreply@saswat.dev";

export async function sendOwnerNotification(ticket: ITicket): Promise<void> {
  const dateStr = new Date(ticket.preferredDate).toDateString();

  await getResend().emails.send({
    from: fromEmail(),
    to: ownerEmail(),
    subject: `New Call Request from ${ticket.viewerName}`,
    html: `
      <h2>New Call Request</h2>
      <p><strong>From:</strong> ${ticket.viewerName} (${ticket.viewerEmail})</p>
      <p><strong>Date:</strong> ${dateStr} at ${ticket.preferredTime}</p>
      <p><strong>Duration:</strong> ${ticket.requestedDuration} minutes</p>
      <p><strong>Reason:</strong> ${ticket.reason}</p>
      <p>
        <a href="${process.env.NEXTAUTH_URL}/dashboard/tickets/${ticket._id}">
          Review Request →
        </a>
      </p>
    `,
  });
}

export async function sendViewerConfirmation(ticket: ITicket): Promise<void> {
  const dateStr = new Date(ticket.preferredDate).toDateString();

  await getResend().emails.send({
    from: fromEmail(),
    to: ticket.viewerEmail,
    subject: "Your Call is Confirmed!",
    html: `
      <h2>Your Call is Confirmed 🎉</h2>
      <p>Hi ${ticket.viewerName},</p>
      <p>Your call has been confirmed with the following details:</p>
      <ul>
        <li><strong>Date:</strong> ${dateStr}</li>
        <li><strong>Time:</strong> ${ticket.preferredTime}</li>
        <li><strong>Duration:</strong> ${ticket.confirmedDuration ?? ticket.requestedDuration} minutes</li>
        <li><strong>Meet Link:</strong> <a href="${ticket.meetLink}">${ticket.meetLink}</a></li>
      </ul>
      <p>See you then!</p>
    `,
  });
}

export async function sendCancellationEmail(
  ticket: ITicket,
  cancelledBy: "owner" | "viewer"
): Promise<void> {
  const dateStr = new Date(ticket.preferredDate).toDateString();
  const recipient = cancelledBy === "owner" ? ticket.viewerEmail : ownerEmail();
  const recipientName = cancelledBy === "owner" ? ticket.viewerName : "Owner";

  await getResend().emails.send({
    from: fromEmail(),
    to: recipient,
    subject: "Call Cancelled",
    html: `
      <h2>Call Cancelled</h2>
      <p>Hi ${recipientName},</p>
      <p>
        The call scheduled for <strong>${dateStr} at ${ticket.preferredTime}</strong>
        has been cancelled by the ${cancelledBy}.
      </p>
      <p>Feel free to schedule a new call if needed.</p>
    `,
  });
}
