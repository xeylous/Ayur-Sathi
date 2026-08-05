"use server";
import mongoose from "mongoose";

const CropSpeciesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    speciesId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const CropSpecies = mongoose.models.CropSpecies || mongoose.model("CropSpecies", CropSpeciesSchema);

export default CropSpecies;
