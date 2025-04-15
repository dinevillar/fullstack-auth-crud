import express from 'express'
import { Product, zProductSchema } from '@/models/Product'
import { z } from 'zod'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const parsedProduct = zProductSchema.parse(req.body);
    const product = new Product(parsedProduct);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export { router }
