import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod'

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const zProductSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  description: z.string().min(1, 'Description is required').trim(),
  price: z.number().min(0, 'Price must be a positive number'),
});

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
