import mongoose from "mongoose";

const ManufacturerCredentialSchema = new mongoose.Schema({
  ManuId: {
    type: String,
    required: true,
    unique: true, // links to LabApplication.labId
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  type:{
    type: String,
    default: "manu",
    enum: ["manu"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.models.ManufacturerCredential ||
  mongoose.model("ManufacturerCredential", ManufacturerCredentialSchema);

