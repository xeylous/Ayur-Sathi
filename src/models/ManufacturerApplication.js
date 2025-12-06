// models/ManufacturerApplication.js
import mongoose from "mongoose";

const ManufacturerApplicationSchema = new mongoose.Schema({
  // Using manufacturerId consistently
  manufacturerId: { type: String, required: true, unique: true },
  manufacturerName: { type: String, required: true },
  factoryAddress: { type: String, required: true },
  ownerName: { type: String, required: true },
  ownerEmail: { type: String, required: true },
  gstNumber: { type: String, required: true },

  documents: {
    gstRegistration: String,
    panCardCopy: String,
    factoryLicense: String,
    ownerIdProof: String,
    signedAgreement: String,
  },

  status: { type: String, default: "Pending Approval" },
  adminNote: { type: String, default: "" },
  decisionAt: { type: Date },
  submittedAt: { type: Date, default: Date.now },
});

// Export model safely to avoid recompilation errors
export default mongoose.models.ManufacturerApplication ||
  mongoose.model("ManufacturerApplication", ManufacturerApplicationSchema);