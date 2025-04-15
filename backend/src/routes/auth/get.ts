import express from 'express'
import { User } from '@/models/User'

const router = express.Router();

router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if ( !user ) {
      return res.status(404).json({ message: 'User not found' });
    }
    const result = {...user.toObject({flattenObjectIds: true}), password: undefined}
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

export { router }
