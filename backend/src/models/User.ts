import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { z } from 'zod'

export interface IUser extends Document {
  name?: string;
  email: string;
  password: string;
  passport: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  verifiedAt: Date;
  createdAt: Date;
}

export const zSignupSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const zUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: false,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    default: ""
  },
  passport: {
    type: String,
    required: false,
    default: null
  },
  verifiedAt: {
    type: Date,
    required: false,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.password || !this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);
