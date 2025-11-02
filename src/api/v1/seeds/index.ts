import { seedCars } from "./carSeeder.js";
import { seedDealers } from "./dealerSeeder.js";

export const seedDatabase = async (): Promise<void> => {
  try {
    // Run all seeders
    await Promise.all([seedCars(), seedDealers()]);

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error during database seeding:", error);
    throw error;
  }
};
