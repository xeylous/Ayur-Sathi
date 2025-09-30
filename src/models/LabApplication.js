// models/LabApplication.js
import mongoose from "mongoose";

const LabApplicationSchema = new mongoose.Schema({
  labName: { type: String, required: true },
  address: { type: String, required: true },
  ownerName: { type: String, required: true },
  ownerEmail: { type: String, required: true },
  panCard: { type: String, required: true },
  documents: {
    ownerIdProof: String,
    panCardDoc: String,
    ownershipDocs: String,
    signedAgreement: String,
  },
  status: { type: String, default: "Pending Approval" },
  adminNote: { type: String, default: "" },
  decisionAt: { type: Date },
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.models.LabApplication ||
  mongoose.model("LabApplication", LabApplicationSchema);
