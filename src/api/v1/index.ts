import express from "express";

import { auctionRoutes } from "./routes/auction/auctionRoutes.js";

const app = express();

app.use("/auction", auctionRoutes);

export { app as apiV1Router };
