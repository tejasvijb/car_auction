import mongoose from "mongoose";

import { seedDatabase } from "../seeds/index.js";

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI || "");
    console.log(`MongoDB Connected: ${connect.connection.host}, ${connect.connection.name}`);

    seedDatabase();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

export default connectDb;
