import mongoose from "mongoose";

import { logger } from "./index";
import { MONGODB_URL } from "./../constants/app";

export const connectToDatabase = async (): Promise<void> => {
  try {
    logger(`Connecting to MongoDB at: ${MONGODB_URL}`);
    await mongoose.connect(MONGODB_URL);
    logger("Connected to MongoDB successfully");
  } catch (error) {
    logger("MongoDB connection error:", error);
    throw error;
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger("Disconnected from MongoDB successfully");
  } catch (error) {
    logger("MongoDB disconnection error:", error);
    throw error;
  }
};
