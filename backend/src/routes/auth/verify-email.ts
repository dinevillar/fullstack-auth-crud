import express from 'express'
import jwt from 'jsonwebtoken'
import { config } from '@/config'
import { User } from '@/models/User'

const router = express.Router();

router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token as string, config.jwtSecret) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    if (user.verifiedAt) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    user.verifiedAt = new Date();
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

export { router };
