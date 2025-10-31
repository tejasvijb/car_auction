import mongoose, { Document, Schema } from "mongoose";

export interface IDealer extends Document {
  address: string;
  dealerId: string;
  email: string;
  name: string;
  phone: string;
  registeredAt: Date;
}

const DealerSchema: Schema = new Schema({
  address: {
    required: true,
    type: String,
  },
  dealerId: {
    required: true,
    type: String,
    unique: true,
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  name: {
    required: true,
    type: String,
  },
  phone: {
    required: true,
    type: String,
  },
  registeredAt: {
    default: Date.now,
    type: Date,
  },
});

export default mongoose.model<IDealer>("Dealer", DealerSchema);
