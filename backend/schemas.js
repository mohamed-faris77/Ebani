import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: String
});

const patientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  concern: String,
});

const appointmentSchema = new mongoose.Schema({
  patientName: String,
  date: String
});

const labReportSchema = new mongoose.Schema({
  patientName: String,
  result: String
});

export const User = mongoose.model('User', userSchema);
export const Patient = mongoose.model('Patient', patientSchema);
export const Appointment = mongoose.model('Appointment', appointmentSchema);
export const LabReport = mongoose.model('LabReport', labReportSchema);
