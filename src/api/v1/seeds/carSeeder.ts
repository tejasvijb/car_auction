import { v4 as uuidv4 } from "uuid";

import Car from "../models/car.model.js";

const carData = [
  {
    carId: uuidv4(),
    carModel: "Camry",
    color: "Silver",
    make: "Toyota",
    mileage: 15000,
    vin: "JT2BF22K1W0123456",
    year: "2023",
  },
  {
    carId: uuidv4(),
    carModel: "Civic",
    color: "Blue",
    make: "Honda",
    mileage: 22000,
    vin: "JHMEJ6674MS041234",
    year: "2022",
  },
  {
    carId: uuidv4(),
    carModel: "Mustang",
    color: "Red",
    make: "Ford",
    mileage: 5000,
    vin: "1FATP8UH3K5123456",
    year: "2023",
  },
  {
    carId: uuidv4(),
    carModel: "3 Series",
    color: "Black",
    make: "BMW",
    mileage: 18000,
    vin: "WBA5A7C55FG123456",
    year: "2022",
  },
  {
    carId: uuidv4(),
    carModel: "Model 3",
    color: "White",
    make: "Tesla",
    mileage: 10000,
    vin: "5YJ3E1EA1PF123456",
    year: "2023",
  },
];

export const seedCars = async (): Promise<void> => {
  try {
    // Check if cars already exist
    const existingCars = await Car.countDocuments();

    if (existingCars === 0) {
      // No cars exist, proceed with seeding
      await Car.insertMany(carData);
      console.log("Cars seeded successfully!");
    } else {
      console.log("Cars collection is not empty. Skipping seed.");
    }
  } catch (error) {
    console.error("Error seeding cars:", error);
    throw error;
  }
};
