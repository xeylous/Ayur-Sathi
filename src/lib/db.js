import mongoose from "mongoose";

export const connectDB = async () => {
  // Check if already connected using Mongoose's connection state
  // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connection.readyState === 1) {
    console.log("Using existing database connection");
    return;
  }

  // If currently connecting, wait for it to complete
  if (mongoose.connection.readyState === 2) {
    console.log("Database connection in progress, waiting...");
    return;
  }

  try {
    console.log("Establishing new database connection...");
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "ayursathi",
    });
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    throw new Error("Database connection failed");
  }
};
