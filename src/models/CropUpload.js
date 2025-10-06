import mongoose from "mongoose";

const CropUploadSchema = new mongoose.Schema(
  {
    batchId: {
      type: String,
      required: true,
      unique: true,
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
    quantity: {
      type: Number,
    },
    // ✅ New field to store barcode URL
    batchBarCode: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
  },
  { timestamps: true }
);

export default mongoose.models.CropUpload ||
  mongoose.model("CropUpload", CropUploadSchema);
