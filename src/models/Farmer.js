"use server";
import mongoose from "mongoose";

const FarmerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // unique within farmers only
    password: { type: String, required: true },
    uniqueId: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    verified: { type: Boolean, default: false },
    phone: { type: String, default: null },
    address: { type: String, default: null },
    pinCode: { type: String, default: null },
  },
  { timestamps: true }
);

const Farmer = mongoose.models.Farmer || mongoose.model("Farmer", FarmerSchema);

export default Farmer;
