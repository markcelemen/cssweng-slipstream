import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendanceEntry extends Document {
    datetime: Date;
    employeeID: number;
    employeeName: string;
    lastName: string;
    firstName: string;
    middleName?: string;
    lateDeduct: number;
    earlyDeduct: number;
    remarks: string;
}
const AttendanceEntrySchema: Schema<IAttendanceEntry> = new Schema({
    datetime: {
        type: Date,
        required: true
    },
    employeeID: {
        type: Number,
        required: true
    },
    employeeName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
        required: false
    },
    lateDeduct: {
        type: Number,
        required: true
    },
    earlyDeduct: {
        type: Number,
        required: true
    },
    remarks: {
        type: String,
        required: true
    }
});

const AttendanceEntryModel = mongoose.model<IAttendanceEntry>('AttendanceEntry', AttendanceEntrySchema);

export default AttendanceEntryModel;
