import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWorkingHour {
  day: string;
  start: string;
  end: string;
}

export interface IOwnerSettings extends Document {
  workingHours: IWorkingHour[];
  defaultDurations: number[];
  timezone: string;
}

const WorkingHourSchema = new Schema<IWorkingHour>(
  {
    day: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  { _id: false }
);

const OwnerSettingsSchema = new Schema<IOwnerSettings>({
  workingHours: { type: [WorkingHourSchema], default: [] },
  defaultDurations: { type: [Number], default: [15, 30, 45, 60] },
  timezone: { type: String, default: "Asia/Kolkata" },
});

const OwnerSettings: Model<IOwnerSettings> =
  mongoose.models.OwnerSettings ??
  mongoose.model<IOwnerSettings>("OwnerSettings", OwnerSettingsSchema);

export default OwnerSettings;
