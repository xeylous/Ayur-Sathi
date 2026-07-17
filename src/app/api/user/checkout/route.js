import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import MarketplaceListing from "@/models/MarketplaceListing";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { cart } = body;

    if (!cart || !Array.isArray(cart)) {
      return NextResponse.json(
        { success: false, message: "Cart data is required and must be an array." },
        { status: 400 }
      );
    }

    // First validate all items to ensure stock is available
    const listingsToUpdate = [];
    for (const item of cart) {
      const { batchId, quantity } = item;
      if (!batchId || typeof quantity !== "number" || quantity <= 0) {
        return NextResponse.json(
          { success: false, message: `Invalid item format for batch ID: ${batchId || "unknown"}` },
          { status: 400 }
        );
      }

      const listing = await MarketplaceListing.findOne({ batchId });
      if (!listing) {
        return NextResponse.json(
          { success: false, message: `Product listing not found for batch ID: ${batchId}` },
          { status: 404 }
        );
      }

      if (listing.quantity < quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Insufficient stock for batch ID: ${batchId}. Available: ${listing.quantity}, requested: ${quantity}`
          },
          { status: 400 }
        );
      }

      listingsToUpdate.push({ listing, quantity });
    }

    // Perform updates now that all stock validations passed
    for (const { listing, quantity } of listingsToUpdate) {
      listing.quantity = Math.max(0, listing.quantity - quantity);
      await listing.save();
    }

    return NextResponse.json({
      success: true,
      message: "Checkout successful. Stock updated."
    });
  } catch (error) {
    console.error("POST /api/user/checkout error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
