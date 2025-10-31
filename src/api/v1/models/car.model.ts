import mongoose, { Schema } from "mongoose";
import z from "zod";

export const zodCarSchema = z.object({
  carId: z.uuid(),
  carModel: z.string().min(2).max(100),
  color: z.string().min(2).max(50),
  createdAt: z.date().default(new Date()),
  make: z.string().min(2).max(100),
  mileage: z.number().min(0),
  vin: z.string().min(17).max(17),
  year: z.string().min(4).max(4),
});

// create a TypeScript interface which extends Document for Car document from zod schema
export type ICar = z.infer<typeof zodCarSchema>;

const CarSchema: Schema = new Schema({
  carId: {
    required: true,
    type: String,
    unique: true,
  },
  carModel: {
    required: true,
    type: String,
  },
  color: {
    required: true,
    type: String,
  },
  createdAt: {
    default: Date.now,
    type: Date,
  },
  make: {
    required: true,
    type: String,
  },
  mileage: {
    required: true,
    type: Number,
  },
  vin: {
    required: true,
    type: String,
    unique: true,
  },
  year: {
    required: true,
    type: String,
  },
});

export default mongoose.model<ICar>("Car", CarSchema);
