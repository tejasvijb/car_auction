import mongoose from "mongoose";

import { seedCars } from "../seeds/carSeeder.js";

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI || "");
    console.log(`MongoDB Connected: ${connect.connection.host}, ${connect.connection.name}`);

    // Seed initial car data
    await seedCars();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

export default connectDb;
