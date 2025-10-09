import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    // console.log("MONGO_URI:", process.env.MONGO_URI); 
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "ayursathi",
    });
    isConnected = true;
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Database connection failed");
  }
};
