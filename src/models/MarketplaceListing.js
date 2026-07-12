import mongoose from "mongoose";

const MarketplaceListingSchema = new mongoose.Schema(
  {
    batchId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    cropUpload: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CropUpload",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    weightGm: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      default: "",
    },
    details: {
      type: String,
      default: "",
    },
    image: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    images: {
      type: [
        {
          url: { type: String },
          publicId: { type: String }
        }
      ],
      default: []
    }
  },
  { timestamps: true }
);

export default mongoose.models.MarketplaceListing ||
  mongoose.model("MarketplaceListing", MarketplaceListingSchema);
