import mongoose, { Document, Schema } from "mongoose";

export interface ICar extends Document {
  car_model: string;
  carId: string;
  color: string;
  createdAt: Date;
  make: string;
  mileage: number;
  vin: string;
  year: string;
}

const CarSchema: Schema = new Schema({
  car_model: {
    required: true,
    type: String,
  },
  carId: {
    required: true,
    type: String,
    unique: true,
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
