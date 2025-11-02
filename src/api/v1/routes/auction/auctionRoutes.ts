import express from "express";

import { createAuction, generateToken, getWinnerBid, placeBid, updateAuctionStatus } from "../../controller/auction.js";
import { validateInput } from "../../middleware/validateInput.js";
import validateToken from "../../middleware/validateToken.js";
import { loginSchema, placeBidSchema } from "../../types/auctionTypes.js";
import { carAuctionInputFields } from "../../types/carTypes.js";

const router = express.Router();

router.post("/token", validateInput(loginSchema), generateToken);

router.post("/createAuction", validateToken, validateInput(carAuctionInputFields), createAuction);

router.patch("/status/:auctionId", validateToken, updateAuctionStatus);

router.post("/placeBids", validateToken, validateInput(placeBidSchema), placeBid);

router.get("/:auctionId/winnerBid", validateToken, getWinnerBid);

export { router as auctionRoutes };
