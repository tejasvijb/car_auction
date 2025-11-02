import mongoose, { Document, Schema } from "mongoose";

export interface IBid extends Document {
  auctionId: string;
  bidAmount: number;
  bidId: string;
  dealerId: string;
  placedAt: Date;
  previousBid: number;
}

const BidSchema: Schema = new Schema({
  auctionId: {
    ref: "Auction",
    required: true,
    type: String,
  },
  bidAmount: {
    min: 0,
    required: true,
    type: Number,
  },
  bidId: {
    required: true,
    type: String,
    unique: true,
  },
  dealerId: {
    ref: "Dealer",
    required: true,
    type: String,
  },
  placedAt: {
    default: Date.now,
    type: Date,
  },
  previousBid: {
    min: 0,
    required: false,
    type: Number,
  },
});

// Index for querying bids by auction
BidSchema.index({ auctionId: 1, bidAmount: -1 });

// Index for querying bids by dealer
BidSchema.index({ dealerId: 1, placedAt: -1 });

export default mongoose.model<IBid>("Bid", BidSchema);
