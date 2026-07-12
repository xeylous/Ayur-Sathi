import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CropUpload from "@/models/CropUpload";
import MarketplaceListing from "@/models/MarketplaceListing";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const queryBatchId = searchParams.get("batchId");

    if (queryBatchId) {
      const listing = await MarketplaceListing.findOne({ batchId: queryBatchId })
        .populate({ path: "cropUpload", model: "CropUpload" })
        .lean();

      if (!listing) {
        return NextResponse.json({
          success: false,
          message: "Product listing not found."
        }, { status: 404 });
      }

      const crop = listing.cropUpload || {};
      const formatted = {
        ...crop,
        batchId: listing.batchId,
        isMarketplaceListed: true,
        marketplacePrice: listing.price,
        marketplaceQuantity: listing.quantity,
        marketplaceWeightGm: listing.weightGm,
        marketplaceDescription: listing.description,
        marketplaceDetails: listing.details,
        marketplaceImage: listing.image,
        marketplaceImages: listing.images || [],
        marketplaceListedAt: listing.createdAt
      };

      return NextResponse.json({
        success: true,
        data: formatted
      });
    }

    // Retrieve all batches that have been listed on the marketplace by the store admin
    const listings = await MarketplaceListing.find()
      .populate({ path: "cropUpload", model: "CropUpload" })
      .sort({ createdAt: -1 })
      .lean();

    // Format output to stay backward compatible with the frontend page expectations
    const formattedData = listings.map(listing => {
      const crop = listing.cropUpload || {};
      return {
        ...crop,
        batchId: listing.batchId,
        isMarketplaceListed: true,
        marketplacePrice: listing.price,
        marketplaceQuantity: listing.quantity,
        marketplaceWeightGm: listing.weightGm,
        marketplaceDescription: listing.description,
        marketplaceDetails: listing.details,
        marketplaceImage: listing.image,
        marketplaceImages: listing.images || [],
        marketplaceListedAt: listing.createdAt
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.error("GET /api/public/marketplace error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
