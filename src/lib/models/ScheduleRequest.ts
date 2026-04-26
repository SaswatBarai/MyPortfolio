import mongoose, { Schema, Document, Model } from "mongoose";

export interface IScheduleRequest extends Document {
  name: string;
  email: string;
  slotId: mongoose.Types.ObjectId;
  date: string;       // "YYYY-MM-DD"
  startTime: string;  // "HH:MM"
  endTime: string;    // "HH:MM"
  message?: string;
  status: "pending" | "approved" | "rejected";
  meetLink?: string;
  googleEventId?: string;
  createdAt: Date;
}

const ScheduleRequestSchema = new Schema<IScheduleRequest>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    slotId: { type: Schema.Types.ObjectId, ref: "AvailableSlot", required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    meetLink: { type: String, default: null },
    googleEventId: { type: String, default: null },
  },
  { timestamps: true }
);

const ScheduleRequest: Model<IScheduleRequest> =
  mongoose.models.ScheduleRequest ||
  mongoose.model<IScheduleRequest>("ScheduleRequest", ScheduleRequestSchema);

export default ScheduleRequest;
