import { z } from 'zod'
import { User } from '@/models/User'
import jwt from 'jsonwebtoken'
import { config } from '@/config'
import express from 'express'
import { mailTransport } from '@/services/mail'

const router = express.Router();

const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

router.post('/signup', async (req, res) => {
  try {
    // Validate request body
    const { email, password } = signupSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ email, password });
    await user.save();

    // Generate email verification token
    const verificationToken = jwt.sign(
      { userId: user._id },
      config.jwtSecret,
      { expiresIn: '1d' }
    );

    const verificationUrl = `${config.serverUrl}/api/auth/verify-email?token=${verificationToken}`;

    await mailTransport.sendMail({
        from: {
          name: config.smtpFromName,
          email: config.smtpFromEmail,
        },
        to: email,
        subject: 'Verify your email',
        html: `<p>Please verify your email by clicking the link below:</p>
             <a href="${verificationUrl}">Verify Email</a>`
      })

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    // Set session
    req.session.userId = user._id.toString();

    // Return user data (excluding password)
    res.status(201).json({
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
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export { router };
