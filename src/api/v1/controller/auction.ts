import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import auctionModel from "../models/auction.model.js";
import carModel from "../models/car.model.js";
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
