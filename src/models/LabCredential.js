import mongoose from "mongoose";

const LabCredentialSchema = new mongoose.Schema({
  labId: {
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.models.LabCredential ||
  mongoose.model("LabCredential", LabCredentialSchema);
