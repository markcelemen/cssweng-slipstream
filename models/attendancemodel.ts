import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendanceEntry extends Document {
  datetime: string;
  employeeID: number;
  employeeName: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  type: "Check In" | "Check Out" | "Incomplete";
  source: "GLog" | "GDoc";
  note?: string;
}

const AttendanceEntrySchema: Schema<IAttendanceEntry> = new Schema({
  datetime: { type: String, required: true },
  employeeID: { type: Number, required: true },
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  middleName: { type: String, required: false },
  type: {
    type: String,
    enum: ["Check In", "Check Out", "Incomplete"],
    required: true,
  },
  source: {
    type: String,
    enum: ["GLog", "GDoc"],
    required: true,
  },
  note: { type: String, required: false }
});

const AttendanceEntryModel =
  mongoose.models.AttendanceEntry ||
  mongoose.model<IAttendanceEntry>("AttendanceEntry", AttendanceEntrySchema);

export default AttendanceEntryModel;
