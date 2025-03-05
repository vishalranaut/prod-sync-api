/** @format */

import mongoose from "mongoose";
import CONFIG from "../config/config";
import { logger } from "../config/logger";

// Connect to MongoDB
const connectMongoDB = async () => {
  try {
    await mongoose.connect(CONFIG.database.mongodbURI, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("Error connecting to MongoDB: ", error);
    process.exit(1);
  }
};

export default connectMongoDB;
