import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAvailableSlot extends Document {
  date: string;      // "YYYY-MM-DD"
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  booked: boolean;
}

const AvailableSlotSchema = new Schema<IAvailableSlot>(
  {
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    booked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

AvailableSlotSchema.index({ date: 1, startTime: 1 }, { unique: true });

const AvailableSlot: Model<IAvailableSlot> =
  mongoose.models.AvailableSlot ||
  mongoose.model<IAvailableSlot>("AvailableSlot", AvailableSlotSchema);

export default AvailableSlot;
