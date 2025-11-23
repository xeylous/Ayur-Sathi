// import mongoose from "mongoose";

// const CropUploadSchema = new mongoose.Schema(
//   {
//     batchId: {
//       type: String,
//       required: true,
//       unique: true,
//       index: true,
//     },
//     uniqueId: {
//       type: String,
//       required: true,
//     },
//     speciesId: {
//       type: String,
//       required: true,
//     },
//     gpsCoordinates: {
//       latitude: { type: Number, required: true },
//       longitude: { type: Number, required: true },
//     },
//     timestamp: {
//       type: Date,
//       default: Date.now,
//     },
//     quantity: {
//       type: Number,
//     },
//     // New field to store barcode URL
//     batchBarCode: {
//       url: { type: String, default: null },
//       publicId: { type: String, default: null },
//     },
//     status: {
//       type: String,
//       enum: ["Pending", "Rejected", "Approved"],
//       default: "Pending",
//     },
//     rejectionReason: { type: String, default: null },
//     acceptedBy: { type: String, default: null },
//     certificate: {
//       url: { type: String, default: null },
//       uploadedAt: { type: Date },
//     },
//     tests: { type: Object, default: {} },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.CropUpload ||
//   mongoose.model("CropUpload", CropUploadSchema);

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

    // New field to store barcode URL
    batchBarCode: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },

    status: {
      type: String,
      enum: ["Pending", "Rejected", "Approved"],
      default: "Pending",
    },

    rejectionReason: { type: String, default: null },

    acceptedBy: { type: String, default: null },

    certificate: {
      url: { type: String, default: null },
      uploadedAt: { type: Date },
    },

    tests: { type: Object, default: {} },

    // --- NEW FIELDS ADDED BELOW ---

    // Manufacturer who accepted the crop
    acceptedByManu: {
      type: String,
      default: null,
    },

    // Date when manufacturer accepted it
    acceptedDate: {
      type: Date,
      default: null,
    },

    // Name of the manufacturing operator
    manuOperatorName: {
      type: String,
      default: null,
    },

    // Processes applied during manufacturing
    manufacturingProcesses: {
      type: [
        {
          processName: { type: String, required: true },
          date: { type: Date, default: Date.now },
          operator: { type: String, default: null },
          notes: { type: String, default: null },
        },
      ],
      default: [],
    },

    // QR Code data for manufactured product
    qrCode: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },

    // Factory location
    manufacturedAt: {
      type: Date,
      default: Date.now,
    },

    // Product expiry date
    productExpiryDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.CropUpload ||
  mongoose.model("CropUpload", CropUploadSchema);
