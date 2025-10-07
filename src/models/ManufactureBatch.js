import mongoose from "mongoose";

const manufactureBatchSchema = new mongoose.Schema(
  {
    batchId: { type: String, required: true, unique: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Completed"],
      default: "Pending",
    },
    reviewedBy: { type: String },
    rejectionReason: { type: String },
    manufacturerId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.ManufactureBatch ||
  mongoose.model("ManufactureBatch", manufactureBatchSchema);
