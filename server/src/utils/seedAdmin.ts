import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model';
import connectDB from '../config/db';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminExists = await User.findOne({ role: 'superadmin' });

    if (!adminExists) {
      const admin = await User.create({
        name: 'Super Admin',
        email: 'admin@portfolio.com',
        password: 'Admin@123456',
        role: 'superadmin',
      });

      console.log('--- DEFAULT ADMIN CREATED ---');
      console.log('Email: admin@portfolio.com');
      console.log('Password: Admin@123456');
      console.log('-----------------------------');
    } else {
      console.log('Super Admin already exists.');
    }

    process.exit();
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

seedAdmin();
