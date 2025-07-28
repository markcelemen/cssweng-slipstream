import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
  employeeID: number;
  lastName: string;
  firstName: string;
  middleName: string;
  department: string;
  coordinator: string;
  position: string;
  contactInfo: string;
  email: string;
  totalSalary: number;
  basicSalary: number;
  birthdate?: string;
  numberOfPTOs?: number;
  remarks?: string;
}

const EmployeeSchema: Schema<IEmployee> = new Schema({
  employeeID: {
    type: Number,
    default: 80000000,
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
    required: true
  },
  department: {
    type: String,
    required: true
  },
  coordinator: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  contactInfo: {
    type: String,
    default: '09123456789',
    required: true
  },
  email: {
    type: String,
    default: 'employee@gmail.com',
    required: true
  },
  totalSalary: {
    type: Number,
    required: true
  },
  basicSalary: {
    type: Number,
    required: true
  },
    birthdate: {
    type: String,
    default: ''
  },
  numberOfPTOs: {
    type: Number,
    default: 0
  },
  remarks: {
  type: String,
  default: '',
  }
});

export const Employee = mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);
