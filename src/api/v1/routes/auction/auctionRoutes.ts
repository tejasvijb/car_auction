import express from "express";

import { createAuction, generateToken } from "../../controller/auction.js";
import { validateInput } from "../../middleware/validateInput.js";
import validateToken from "../../middleware/validateToken.js";
import { loginSchema } from "../../types/auctionTypes.js";
import { carAuctionInputFields } from "../../types/carTypes.js";

const router = express.Router();

router.post("/token", validateInput(loginSchema), generateToken);

router.post("/createAuction", validateToken, validateInput(carAuctionInputFields), createAuction);

router.patch("/status/:auctionId", validateToken, (req, res) => {
  const { auctionId } = req.params;
  const { status } = req.body;

  // Here you would typically update the auction status in your database
  res.status(200).json({ status: `Auction ${auctionId} status updated to ${status}`, username: req.user?.username || "user not found" });
});

router.get("/:auctionId/winnerBid", validateToken, (req, res) => {
  const { auctionId } = req.params;
  // Here you would typically fetch the winner bid from your database
  res.status(200).json({ status: `Winner bid for auction ${auctionId} fetched successfully`, username: req.user?.username || "user not found" });
});

router.post("/placeBids", validateToken, (req, res) => {
  res.status(200).json({ status: "Place Bids service is running", username: req.user?.username || "user not found" });
});

export { router as auctionRoutes };
