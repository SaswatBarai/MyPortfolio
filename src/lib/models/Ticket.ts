import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITicket extends Document {
  viewerName: string;
  viewerEmail: string;
  reason: string;
  preferredDate: Date;
  preferredTime: string;
  requestedDuration: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  meetLink?: string;
  googleEventId?: string;
  confirmedDuration?: number;
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema = new Schema<ITicket>(
  {
    viewerName: { type: String, required: true, trim: true },
    viewerEmail: { type: String, required: true, trim: true, lowercase: true },
    reason: { type: String, required: true },
    preferredDate: { type: Date, required: true },
    preferredTime: { type: String, required: true },
    requestedDuration: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    meetLink: { type: String },
    googleEventId: { type: String },
    confirmedDuration: { type: Number },
  },
  { timestamps: true }
);

const Ticket: Model<ITicket> =
  mongoose.models.Ticket ?? mongoose.model<ITicket>("Ticket", TicketSchema);

export default Ticket;
