import mongoose from "mongoose";
import dns from "dns";

// Set DNS servers to Google and Cloudflare public DNS to bypass local router/ISP SRV/TXT record resolution failures
if (dns && typeof dns.setServers === "function") {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch (error) {
    console.warn("⚠️ Failed to set DNS servers:", error);
  }
}

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
