'use server';
import mongoose from "mongoose";

const FarmerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // unique within farmers only
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const Farmer = mongoose.models.Farmer || mongoose.model("Farmer", FarmerSchema);

export default Farmer;
