import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import auctionModel from "../models/auction.model.js";
import bidModel from "../models/bid.model.js";
import carModel from "../models/car.model.js";
import dealerModel from "../models/dealer.model.js";
import { LoginType } from "../types/auctionTypes.js";

export const generateToken = asyncHandler(async (req: Request, res: Response) => {
  const body: LoginType = req.body;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  if (!accessTokenSecret) {
    res.status(500);
    throw new Error("Internal server error: ACCESS_TOKEN_SECRET is not defined");
  }

  // dummy user for demonstration; replace with real user lookup, check for username: Admin and password: Admin in body

  const isAuthenticated = body.username === "Admin" && body.password === "Admin";

  // compare password with hashed password
  if (isAuthenticated) {
    const accessToken = jwt.sign(
      {
        user: {
          username: body.username,
        },
      },
      accessTokenSecret,
      {
        expiresIn: "1h",
      },
    );
    res.status(200).json({
      accessToken,
    });
  } else {
    res.status(401);
    throw new Error("Invalid username or password");
  }
});

export const createAuction = asyncHandler(async (req: Request, res: Response) => {
  const { carId, endTime, startingPrice, startTime } = req.body;

  // Check if car exists
  const car = await carModel.findOne({ carId });

  console.log(car);

  if (!car) {
    res.status(404).json({ message: "Car not found." });
  }

  // Check if car already in auction
  const existingAuction = await auctionModel.findOne({ carId, status: { $in: ["pending", "active"] } });

  if (existingAuction) {
    res.status(400).json({ message: "Car already has an active/pending auction." });
  }

  // Create new auction
  const newAuction = {
    auctionId: uuidv4(),
    carId,
    createdAt: new Date().toISOString(),
    currentPrice: startingPrice,
    endTime,
    startingPrice,
    startTime,
    status: "pending",
  };

  await auctionModel.create(newAuction);

  res.status(201).json({
    auction: newAuction,
    message: "Auction created successfully.",
  });
});

export const updateAuctionStatus = asyncHandler(async (req: Request, res: Response) => {
  const { auctionId } = req.params;
  const { status } = req.body;

  // Validate status
  const validStatuses = ["pending", "active", "ended", "cancelled"];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid status. Status must be one of: pending, active, ended, cancelled");
  }

  // Find and update auction
  const auction = await auctionModel.findOne({ auctionId });

  if (!auction) {
    res.status(404);
    throw new Error("Auction not found");
  }

  // Additional validation rules
  if (auction.status === "ended" || auction.status === "cancelled") {
    res.status(400);
    throw new Error("Cannot update status of ended or cancelled auctions");
  }

  if (status === "active" && new Date() < auction.startTime) {
    res.status(400);
    throw new Error("Cannot activate auction before start time");
  }

  if (status === "active" && new Date() > auction.endTime) {
    res.status(400);
    throw new Error("Cannot activate auction after end time");
  }

  // Update auction status
  auction.status = status;
  await auction.save();

  res.status(200).json({
    auction,
    message: `Auction status updated successfully to ${status}`,
  });
});

export const placeBid = asyncHandler(async (req: Request, res: Response) => {
  const { auctionId, bidAmount, dealerId } = req.body;

  // Find the auction
  const auction = await auctionModel.findOne({ auctionId });
  if (!auction) {
    res.status(404).json({ message: "Auction not found" });
    return;
  }

  // Check if auction is active
  if (auction.status !== "active") {
    res.status(400).json({ message: "Bids can only be placed on active auctions" });
    return;
  }

  // Check auction timing
  const now = new Date();
  if (now < auction.startTime || now > auction.endTime) {
    res.status(400).json({ message: "Auction is not currently active" });
    return;
  }

  // Check if dealer exists
  const dealer = await dealerModel.findOne({ dealerId });
  if (!dealer) {
    res.status(404).json({ message: "Dealer not found" });
    return;
  }

  // Validate bid amount
  if (bidAmount <= auction.currentPrice) {
    res.status(400).json({ message: `Bid amount must be higher than current price of ${auction.currentPrice}` });
    return;
  }

  // Create new bid
  const bid = {
    auctionId: auction.auctionId, // Use the string auctionId from the auction
    bidAmount,
    bidId: uuidv4(),
    dealerId: dealer.dealerId, // Use the string dealerId from the dealer
    placedAt: now,
    previousBid: auction.currentPrice,
  };

  // Update auction's current price
  auction.currentPrice = bidAmount;
  await auction.save();

  // Save the bid
  await bidModel.create(bid);

  res.status(201).json({
    bid,
    message: "Bid placed successfully",
  });
});

export const getWinnerBid = asyncHandler(async (req: Request, res: Response) => {
  const { auctionId } = req.params;

  // Find the auction
  const auction = await auctionModel.findOne({ auctionId });
  if (!auction) {
    res.status(404).json({ message: "Auction not found" });
    return;
  }

  // Check if auction is ended
  if (auction.status !== "ended") {
    res.status(400).json({ message: "Cannot get winner bid for an auction that hasn't ended" });
    return;
  }

  // Get the highest bid for this auction
  const winnerBid = await bidModel.findOne({ auctionId }).sort({ bidAmount: -1 }).lean();

  if (!winnerBid) {
    res.status(404).json({ message: "No bids found for this auction" });
    return;
  }

  // Get dealer details
  const dealer = await dealerModel.findOne({ dealerId: winnerBid.dealerId }).lean();

  if (!winnerBid) {
    res.status(404).json({ message: "No bids found for this auction" });
    return;
  }

  // Get car details for the auction
  const car = await carModel.findOne({ carId: auction.carId }).lean();

  res.status(200).json({
    auction: {
      auctionId: auction.auctionId,
      endTime: auction.endTime,
      finalPrice: auction.currentPrice,
      startTime: auction.startTime,
    },
    car: car
      ? {
          carModel: car.carModel,
          make: car.make,
          vin: car.vin,
          year: car.year,
        }
      : null,
    winningBid: {
      bidAmount: winnerBid.bidAmount,
      bidId: winnerBid.bidId,
      placedAt: winnerBid.placedAt,
      winner: dealer
        ? {
            dealerId: dealer.dealerId,
            email: dealer.email,
            name: dealer.name,
            phone: dealer.phone,
          }
        : null,
    },
  });
});
