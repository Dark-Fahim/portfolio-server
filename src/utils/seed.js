import 'dotenv/config';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import SiteSettings from '../models/SiteSettings.js';
import mongoose from 'mongoose';

async function seed() {
  await connectDB();

  const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (existingAdmin) {
    console.log('Admin user already exists — skipping creation.');
  } else {
    await User.create({
      name: process.env.ADMIN_NAME || '[YOUR NAME]',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
    });
    console.log(`Admin user created: ${process.env.ADMIN_EMAIL}`);
  }

  const existingSettings = await SiteSettings.findOne();
  if (!existingSettings) {
    await SiteSettings.create({ name: process.env.ADMIN_NAME || '[YOUR NAME]' });
    console.log('Default site settings created.');
  } else {
    console.log('Site settings already exist — skipping.');
  }

  await mongoose.disconnect();
  console.log('Seeding complete.');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
