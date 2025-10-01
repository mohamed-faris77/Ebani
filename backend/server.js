import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import { User } from './schemas.js';
import router from './routes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

const PORT = process.env.PORT || 5000;
const SALT_ROUNDS = 10;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(
  () => { console.log('DB Connected'); }
).catch((error) => { console.log('Error' + error); })



//routes
app.use(router);


// Create default admin user
async function ensureAdminUser() {
  const admin = await User.findOne({ username: 'admin' });
  if (!admin) {
    const hashedPassword = await bcrypt.hash('admin123', SALT_ROUNDS);
    await User.create({ username: 'admin', password: hashedPassword, role: 'admin' });
    console.log('Default admin user created: admin/admin123');
  } else {
    console.log('Admin user already exists');
  }
}

app.listen(PORT, async () => {
  console.log('Server is running on port ', PORT);
  await ensureAdminUser();
});