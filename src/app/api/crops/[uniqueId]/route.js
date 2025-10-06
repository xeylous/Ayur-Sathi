import { connectDB } from "@/lib/db";
import CropUpload from "@/models/CropUpload";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { uniqueId } = params;

    if (!uniqueId) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing uniqueId" }),
        { status: 400 }
      );
    }

    // ✅ Find all crops for this farmer (by uniqueId)
    const crops = await CropUpload.find({ uniqueId }).sort({ createdAt: -1 });

    if (!crops.length) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No crops found for this farmer",
          data: [],
        }),
        { status: 200 }
      );
    }

    // ✅ Return formatted response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Crops fetched successfully",
        count: crops.length,
        data: crops,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching crops:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Internal server error",
      }),
      { status: 500 }
    );
  }
}
