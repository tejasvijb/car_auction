import { v4 as uuidv4 } from "uuid";

import Dealer from "../models/dealer.model.js";

const dealerData = [
  {
    address: "123 Auto Plaza Dr, San Jose, CA 95110",
    dealerId: uuidv4(),
    email: "john.smith@premiumautos.com",
    name: "John Smith",
    phone: "408-555-0123",
  },
  {
    address: "456 Car Center Blvd, Los Angeles, CA 90012",
    dealerId: uuidv4(),
    email: "mary.johnson@elitecars.com",
    name: "Mary Johnson",
    phone: "213-555-0456",
  },
  {
    address: "789 Dealer Way, San Francisco, CA 94105",
    dealerId: uuidv4(),
    email: "david.brown@luxurydealer.com",
    name: "David Brown",
    phone: "415-555-0789",
  },
  {
    address: "321 Motors Street, Sacramento, CA 95814",
    dealerId: uuidv4(),
    email: "sarah.wilson@carexperts.com",
    name: "Sarah Wilson",
    phone: "916-555-0321",
  },
  {
    address: "654 Auto Mall Pkwy, San Diego, CA 92101",
    dealerId: uuidv4(),
    email: "michael.davis@topgears.com",
    name: "Michael Davis",
    phone: "619-555-0654",
  },
];

export const seedDealers = async (): Promise<void> => {
  try {
    // Check if dealers already exist
    const existingDealers = await Dealer.countDocuments();

    if (existingDealers === 0) {
      // No dealers exist, proceed with seeding
      await Dealer.insertMany(dealerData);
      console.log("Dealers seeded successfully!");
    } else {
      console.log("Dealers collection is not empty. Skipping seed.");
    }
  } catch (error) {
    console.error("Error seeding dealers:", error);
    throw error;
  }
};
