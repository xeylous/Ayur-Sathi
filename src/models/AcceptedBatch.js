// models/AcceptedBatch.js
import mongoose from "mongoose";

const AcceptedBatchSchema = new mongoose.Schema(
  {
    batchId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    cropData: {
      type: Object, // store the full crop details
      required: true,
    },
    acceptedBy: {
      type: String, // optional: lab user ID or name
    },
    acceptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.AcceptedBatch ||
  mongoose.model("AcceptedBatch", AcceptedBatchSchema);
