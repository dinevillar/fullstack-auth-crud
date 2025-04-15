import express from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { User } from '@/models/User';
import { config } from '@/config';
import { sendHtmlEmail } from '@/services/mail'

const router = express.Router();

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user._id },
      config.jwtSecret,
      { expiresIn: '1h' } // Token valid for 1 hour
    );

    // Send reset email
    const resetLink = `${config.clientUrl}/reset-password?token=${resetToken}`;
    await sendHtmlEmail(
      email,
      'Password Reset',
      `<p>Click here to reset your password:</p>
       <a href="${resetLink}">Reset Password</a>`
    )

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export { router };
