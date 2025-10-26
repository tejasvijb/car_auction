import { type NextFunction, type Request, type Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const validateToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;
  const authHeader = req.headers.authorization;

  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401);
      throw new Error("User is not authorized or token is missing");
    }
    if (!process.env.ACCESS_TOKEN_SECRET) {
      res.status(500);
      throw new Error("Internal server error: ACCESS_TOKEN_SECRET is not defined");
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: err.message });
        throw new Error("User is not authorized");
      }
      console.log(decoded);
      // convert exp unix timestamp to Date object if needed
      req.user = (decoded as { user: { username: string } }).user;
      next();
    });
  } else {
    res.status(401);
    throw new Error("User is not authorized or token is missing");
  }
});

export default validateToken;
