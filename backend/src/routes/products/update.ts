import express from 'express'
import { Product, zProductSchema } from '@/models/Product'
import { z } from 'zod'

const router = express.Router()

router.put('/:id', async (req, res) => {
  try {
    const parsedProduct = zProductSchema.parse(req.body);
    const product = await Product.findByIdAndUpdate(req.params.id, parsedProduct, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export { router }
