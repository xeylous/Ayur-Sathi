import mongoose from "mongoose";

const AcceptedBatchByManuSchema = new mongoose.Schema(
  {
    batchId: { type: String, required: true, unique: true },
    cropDetails: { type: Object, required: true },
    acceptedByManu: { type: String, required: true },
    acceptedDate: { type: Date, default: Date.now },
    manuOperatorName: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.AcceptedBatchByManu ||
  mongoose.model("AcceptedBatchByManu", AcceptedBatchByManuSchema);
