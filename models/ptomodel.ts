import mongoose, { Schema, Document } from 'mongoose';

export interface IPTO extends Document {
  employeeID: number;
  date: Date;
  credit: number;
}

const PTOSchema: Schema<IPTO> = new Schema({
  employeeID: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  credit: {
    type: Number,
    required: true,
  },
});

const PTOModel = mongoose.models.PTO || mongoose.model<IPTO>('PTO', PTOSchema);

export default PTOModel;
