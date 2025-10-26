import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

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
