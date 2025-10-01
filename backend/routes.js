import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, Patient, Appointment, LabReport } from './schemas.js';

const router = express.Router();

const SALT_ROUNDS = 10;

function authenticateJWT(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Registration
router.post('/api/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) return res.status(400).json({ message: 'All fields required' });
  const existing = await User.findOne({ username });
  if (existing) return res.status(409).json({ message: 'Username already exists' });
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = new User({ username, password: hashedPassword, role });
  await user.save();
  res.json({ success: true, message: 'User registered' });
});

// Login
router.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    req.session.user = user;
    res.json({ success: true, token, user: { id: user._id, username: user.username, role: user.role } });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Reception Module 
router.get('/api/patients', authenticateJWT, async (req, res) => {
  if (!['reception', 'admin', 'lab', 'doctor'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  const patients = await Patient.find();
  res.json(patients);
});
router.post('/api/patients', authenticateJWT, async (req, res) => {
  if (!['doctor', 'reception', 'admin'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  const { name, age, concern } = req.body;
  if (!name || !age) return res.status(400).json({ message: 'Name and age required' });
  const patient = new Patient({ name, age, concern });
  await patient.save();
  res.json(patient);
});
router.get('/api/appointments', authenticateJWT, async (req, res) => {
  if (req.user.role !== 'reception' && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const appointments = await Appointment.find();
  res.json(appointments);
});
router.post('/api/appointments', authenticateJWT, async (req, res) => {
  if (req.user.role !== 'reception' && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const { patientName, date } = req.body;
  if (!patientName || !date) {
    return res.status(400).json({ message: 'Patient and date are required' });
  }
  try {
    const appointment = new Appointment({ patientName, date: String(date) });
    await appointment.save();
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ message: 'Error creating appointment', error: err.message });
  }
});

// Doctor Module
router.get('/api/doctor/patients', authenticateJWT, async (req, res) => {
  if (req.user.role !== 'doctor' && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const patients = await Patient.find();
  res.json(patients);
});
router.post('/api/doctor/patients/:id/notes', authenticateJWT, async (req, res) => {
  if (req.user.role !== 'doctor' && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const patient = await Patient.findById(req.params.id);
  if (patient) {
    patient.notes.push(req.body.note);
    await patient.save();
    res.json(patient);
  } else {
    res.status(404).json({ message: 'Patient not found' });
  }
});
router.get('/api/doctor/appointments', authenticateJWT, async (req, res) => {
  if (req.user.role !== 'doctor' && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const appointments = await Appointment.find();
  res.json(appointments);
});

// Lab Module
router.get('/api/labreports', authenticateJWT, async (req, res) => {
  if (req.user.role !== 'lab' && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const labReports = await LabReport.find();
  res.json(labReports);
});
router.post('/api/labreports', authenticateJWT, async (req, res) => {
  if (req.user.role !== 'lab' && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const { patientName, result } = req.body;
  if (!patientName || !result) {
    return res.status(400).json({ message: 'Patient and result are required' });
  }
  try {
    const report = new LabReport({ patientName, result: String(result) });
    await report.save();
    res.json(report);
  } catch (err) {
    res.status(400).json({ message: 'Error creating lab report', error: err.message });
  }
});

// Admin Module
router.get('/api/users', authenticateJWT, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  const total = await User.countDocuments();
  const totalPages = Math.ceil(total / limit);
  const users = await User.find({}, 'username role').skip(skip).limit(limit);
  res.json({ users, totalPages });
});
router.put('/api/users/:id', authenticateJWT, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const { username, role } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { username, role }, { new: true });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ success: true, user });
});
router.delete('/api/users/:id', authenticateJWT, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ success: true });
});

export default router;
