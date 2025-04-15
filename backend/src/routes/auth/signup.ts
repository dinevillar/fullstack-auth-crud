import { z } from 'zod'
import { User, zSignupSchema } from '@/models/User'
import jwt from 'jsonwebtoken'
import { config } from '@/config'
import express from 'express'
import { sendHtmlEmail } from '@/services/mail'

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = zSignupSchema.parse(req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ email, password });
    await user.save();

    const verificationToken = jwt.sign(
      { userId: user._id },
      config.jwtSecret,
      { expiresIn: '1d' }
    );

    const verificationUrl = `${config.serverUrl}/api/auth/verify-email?token=${verificationToken}`;
    await sendHtmlEmail(
      email,
      'Verify your email',
      `<p>Please verify your email by clicking the link below:</p>
       <a href="${verificationUrl}">Verify Email</a>`
    )

    const token = jwt.sign(
      { userId: user._id },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    req.session.userId = user._id.toString();

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
