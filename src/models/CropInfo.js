"use server";
import mongoose from "mongoose";

const CropInfoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    speciesId: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    uses: [{ type: String }],
    benefits: [{ type: String }],
    disadvantages: [{ type: String }],
  },
  { timestamps: true }
);

const CropInfo = mongoose.models.CropInfo || mongoose.model("CropInfo", CropInfoSchema);

export default CropInfo;
