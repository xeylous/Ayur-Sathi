import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import CropUpload from "@/models/CropUpload";
import cloudinary from "@/lib/cloudinary";
import MarketplaceListing from "@/models/MarketplaceListing";

export async function GET(req) {
  try {
    // 1️⃣ Read auth token
    const cookie = req.cookies.get("auth_token");
    if (!cookie) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No token provided." },
        { status: 401 }
      );
    }

    const token = cookie.value;

    // 2️⃣ Validate token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token." },
        { status: 401 }
      );
    }

    const isAdmin = decoded.role === "admin" || decoded.type === "admin" || 
                    decoded.role === "store_admin" || decoded.type === "store_admin";

    // restrict only manufacturers and admins
    if (decoded.type !== "manu" && !isAdmin) {
      return NextResponse.json(
        { success: false, message: "Access denied." },
        { status: 403 }
      );
    }

    await connectDB();

    // 3️⃣ Pagination & Date Filters
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // 4️⃣ Only completed batches with QR
    const query = {
      acceptedByManu: { $ne: null },
      manufacturedAt: { $exists: true },
      "qrCode.url": { $ne: null }
    };

    if (startDate || endDate) {
      query.manufacturedAt = { $exists: true };
      if (startDate) {
        query.manufacturedAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.manufacturedAt.$lte = end;
      }
    }

    // show only manufacturer-owned batches if not admin
    if (!isAdmin) {
      query.acceptedByManu = decoded.manuId;
    }

    // 5️⃣ Fetch sorted latest first
    const records = await CropUpload.find(query)
      .sort({ manufacturedAt: -1 })  // 🔥 ensures newest first
      .skip(skip)
      .limit(limit)
      .lean();

    const batchIds = records.map(r => r.batchId);
    const listings = await MarketplaceListing.find({ batchId: { $in: batchIds } }).lean();

    const mergedRecords = records.map(record => {
      const listing = listings.find(l => l.batchId === record.batchId);
      if (listing) {
        return {
          ...record,
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
      }
      return {
        ...record,
        isMarketplaceListed: false
      };
    });

    const total = await CropUpload.countDocuments(query);

    return NextResponse.json({
      success: true,
      message: "Manufactured batches retrieved successfully.",
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        itemsReturned: mergedRecords.length,
      },
      data: mergedRecords,
    });

  } catch (err) {
    console.error("Error fetching manufactured data:", err);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    // 1️⃣ Auth Check
    const cookie = req.cookies.get("auth_token");
    if (!cookie) {
      return NextResponse.json(
        { success: false, message: "Access denied. No token provided." },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(cookie.value, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired session token." },
        { status: 401 }
      );
    }

    const isAdmin =
      decoded.role === "admin" ||
      decoded.type === "admin" ||
      decoded.role === "store_admin" ||
      decoded.type === "store_admin";

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Only administrators can list items on the marketplace." },
        { status: 403 }
      );
    }

    // 2️⃣ DB Connect
    await connectDB();

    // 3️⃣ Extract inputs from FormData
    const formData = await req.formData();
    const batchId = formData.get("batchId");
    const priceStr = formData.get("price");
    const quantityStr = formData.get("quantity");
    const weightGmStr = formData.get("weightGm");
    const description = formData.get("description") || "";
    const details = formData.get("details") || "";
    const image = formData.get("image"); // This can be a File or a String URL (or null)

    if (!batchId) {
      return NextResponse.json(
        { success: false, message: "Batch ID is required." },
        { status: 400 }
      );
    }

    if (priceStr === null || priceStr === "" || Number(priceStr) < 0) {
      return NextResponse.json(
        { success: false, message: "A valid positive price is required." },
        { status: 400 }
      );
    }

    if (quantityStr === null || quantityStr === "" || Number(quantityStr) < 0) {
      return NextResponse.json(
        { success: false, message: "A valid positive quantity is required." },
        { status: 400 }
      );
    }

    if (weightGmStr === null || weightGmStr === "" || Number(weightGmStr) < 0) {
      return NextResponse.json(
        { success: false, message: "A valid positive weight in grams is required." },
        { status: 400 }
      );
    }

    // 4️⃣ Find batch
    const batch = await CropUpload.findOne({ batchId });
    if (!batch) {
      return NextResponse.json(
        { success: false, message: "Batch not found." },
        { status: 404 }
      );
    }

    // Ensure it is manufactured
    if (!batch.manufacturedAt || !batch.qrCode?.url) {
      return NextResponse.json(
        { success: false, message: "Cannot list a batch on the marketplace before manufacturing process logging and QR generation are completed." },
        { status: 400 }
      );
    }

    // Handle optional multiple image uploads
    let existingListing = await MarketplaceListing.findOne({ batchId });
    let uploadedImages = existingListing?.images || [];

    const imageFilesOrUrls = formData.getAll("images");

    // Filter out empty strings and zero-size files
    const validImageEntries = imageFilesOrUrls.filter(img => {
      if (typeof img === "string") return img.trim().length > 0;
      if (img && img.size > 0) return true;
      return false;
    });


    if (validImageEntries.length > 0) {
      try {
        const uploadPromises = validImageEntries.map(async (img) => {
          if (typeof img === "string") {
            // Re-use already-uploaded image by URL
            const found = uploadedImages.find(existing => existing.url === img);
            if (found) return found;
            return { url: img, publicId: null };
          } else {
            // New file upload to Cloudinary
            const buffer = Buffer.from(await img.arrayBuffer());
            const uploadRes = await new Promise((resolve, reject) => {
              cloudinary.uploader.upload_stream(
                {
                  folder: "marketplaceProducts",
                  resource_type: "image",
                },
                (error, result) => {
                  if (error) reject(error);
                  else resolve({
                    url: result.secure_url,
                    publicId: result.public_id
                  });
                }
              ).end(buffer);
            });
            return uploadRes;
          }
        });

        const resolvedImages = await Promise.all(uploadPromises);
        uploadedImages = resolvedImages.filter(img => img !== null);
      } catch (err) {
        console.error("Cloudinary marketplace product images upload failed:", err);
        return NextResponse.json(
          { success: false, message: "Failed to upload product images." },
          { status: 500 }
        );
      }
    }


    // Save marketplace listing using MarketplaceListing model
    // Use $set to explicitly force-write the images array
    const listing = await MarketplaceListing.findOneAndUpdate(
      { batchId },
      {
        $set: {
          cropUpload: batch._id,
          price: Number(priceStr),
          quantity: Number(quantityStr),
          weightGm: Number(weightGmStr),
          description,
          details,
          image: uploadedImages[0] || { url: null, publicId: null },
          images: uploadedImages
        }
      },
      { new: true, upsert: true }
    ).lean();


    // Reconstruct the response data format that frontend expects
    const responseData = {
      ...batch.toObject(),
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
      message: `Batch '${batchId}' successfully listed on the marketplace.`,
      data: responseData
    });

  } catch (error) {
    console.error("PUT /api/manufactured error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
