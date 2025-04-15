import express from 'express'
import { z } from 'zod'
import { User, zUpdateSchema } from '@/models/User'

const router = express.Router();

router.put('/user/:id', async (req, res) => {
  try {
    // Validate request body
    const parsedUser = zUpdateSchema.parse(req.body);
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    Object.assign(user, parsedUser);
    user.save()
    res.status(200).json({...user.toObject({flattenObjectIds: true}), password: undefined});
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

export { router }
