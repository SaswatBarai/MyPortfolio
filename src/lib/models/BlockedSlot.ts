import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlockedSlot extends Document {
  type: "full_day" | "time_range";
  date?: Date;
  startTime?: string;
  endTime?: string;
  recurrence?: "none" | "daily" | "weekdays" | "weekends" | "weekly";
  reason?: string;
  createdAt: Date;
}

const BlockedSlotSchema = new Schema<IBlockedSlot>(
  {
    type: { type: String, enum: ["full_day", "time_range"], required: true },
    date: { type: Date },
    startTime: { type: String },
    endTime: { type: String },
    recurrence: {
      type: String,
      enum: ["none", "daily", "weekdays", "weekends", "weekly"],
      default: "none",
    },
    reason: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const BlockedSlot: Model<IBlockedSlot> =
  mongoose.models.BlockedSlot ??
  mongoose.model<IBlockedSlot>("BlockedSlot", BlockedSlotSchema);

export default BlockedSlot;
