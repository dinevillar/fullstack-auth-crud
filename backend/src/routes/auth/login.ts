import express from 'express';
import { User } from '@/models/User';
import jwt from 'jsonwebtoken';
import { config } from '@/config';
import { z } from 'zod';

const router = express.Router();

// Login schema for email/password
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string(),
});

// Email/password login route
router.post('/login', async (req, res) => {
  try {
    // Validate request body
    const { email, password } = loginSchema.parse(req.body);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    // Set session
    req.session.userId = user._id.toString();

    // Return user data (excluding password)
    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export { router };
