import mongoose from 'mongoose';
import { config } from 'dotenv';

// LOAD ENV
config();

export const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {});
    console.log('Database connected');
  } catch (error) {
    console.error('Error while connecting database');
    throw error;
  }
};
