import { z } from 'zod'
import jwt from 'jsonwebtoken'
import { config } from '@/config'
import { User } from '@/models/User'
import express from 'express'

const router = express.Router();

const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = resetPasswordSchema.parse(req.body);

    const decoded: any = jwt.verify(token, config.jwtSecret);
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export { router };
