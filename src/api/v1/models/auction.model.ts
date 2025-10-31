import mongoose, { Schema } from "mongoose";

export interface IAuction {
  auctionId: string;
  carId: string;
  createdAt: Date;
  currentPrice: number;
  endTime: Date;
  startingPrice: number;
  startTime: Date;
  status: "active" | "cancelled" | "ended" | "pending";
}

const AuctionSchema: Schema = new Schema({
  auctionId: {
    required: true,
    type: String,
    unique: true,
  },
  carId: {
    ref: "Car",
    required: true,
    type: String,
  },
  createdAt: {
    default: Date.now,
    type: Date,
  },
  currentPrice: {
    min: 0,
    required: true,
    type: Number,
  },
  endTime: {
    required: true,
    type: Date,
  },
  startingPrice: {
    min: 0,
    required: true,
    type: Number,
  },
  startTime: {
    required: true,
    type: Date,
  },
  status: {
    default: "pending",
    enum: ["pending", "active", "ended", "cancelled"],
    required: true,
    type: String,
  },
});

// Index for querying active auctions
AuctionSchema.index({ endTime: 1, status: 1 });

// Index for querying auctions by car
AuctionSchema.index({ carId: 1 });

export default mongoose.model<IAuction>("Auction", AuctionSchema);
