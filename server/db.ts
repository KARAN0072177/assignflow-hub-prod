// server/db.ts
import mongoose from "mongoose";
import { config } from "./config";

/**
 * MongoDB connection handler
 */
export const connectDB = async (): Promise<void> => {
  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(config.mongoUri);

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed");
    console.error(error);
    process.exit(1);
  }
};

/**
 * Graceful shutdown
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log("🛑 MongoDB connection closed");
  } catch (error) {
    console.error("❌ Error closing MongoDB connection");
    console.error(error);
  }
};