import mongoose from "mongoose";

const CropUploadSchema = new mongoose.Schema(
  {
    batchId: {
      type: String,
      required: true,
      unique: true, // enforce unique batchId across all data
      index: true,
    },
    uniqueId: {
      type: String,
      required: true,
    },
    speciesId: {
      type: String,
      required: true,
    },
    gpsCoordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    initialQualityMetrics: {
      moisture: { type: Number },
      weight: { type: Number },
      purity: { type: Number },
      remarks: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.models.CropUpload ||
  mongoose.model("CropUpload", CropUploadSchema);
