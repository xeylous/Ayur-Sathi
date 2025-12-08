// import { connectDB } from "@/lib/db";
// import CropUpload from "@/models/CropUpload";
// import jwt from "jsonwebtoken";

// export async function GET(req, { params }) {
//   try {
//     await connectDB();
//     // Get token from cookies
//     const cookie = req.cookies.get("auth_token");
//     if (!cookie) {
//       return new Response(
//         JSON.stringify({ success: false, message: "No auth token provided" }),
//         { status: 401 }
//       );
//     }

//     const token = cookie.value;

//     // Verify JWT token
//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (err) {
//       console.error("JWT verification failed:", err);
//       return new Response(
//         JSON.stringify({ success: false, message: "Invalid or expired token" }),
//         { status: 401 }
//       );
//     }


//     const { uniqueId } = await params;

//     if (!uniqueId) {
//       return new Response(
//         JSON.stringify({ success: false, message: "Missing uniqueId" }),
//         { status: 400 }
//       );
//     }
//     if (decoded.uniqueId !== uniqueId) {
//       return new Response(
//         JSON.stringify({ success: false, message: "Unauthorized access" }),
//         { status: 403 }
//       );
//     }

//     // ✅ Find all crops for this farmer (by uniqueId)
//     const crops = await CropUpload.find({ uniqueId }).sort({ createdAt: -1 });

//     if (!crops.length) {
//       return new Response(
//         JSON.stringify({
//           success: true,
//           message: "No crops found for this farmer",
//           data: [],
//         }),
//         { status: 200 }
//       );
//     }

//     // ✅ Return formatted response
//     return new Response(
//       JSON.stringify({
//         success: true,
//         message: "Crops fetched successfully",
//         count: crops.length,
//         data: crops,
//       }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching crops:", error);
//     return new Response(
//       JSON.stringify({
//         success: false,
//         message: error.message || "Internal server error",
//       }),
//       { status: 500 }
//     );
//   }
// }

import { connectDB } from "@/lib/db";
import CropUpload from "@/models/CropUpload";
import jwt from "jsonwebtoken";

export async function GET(req, { params }) {
  try {
    await connectDB();

    // Get token from cookies
    const cookie = req.cookies.get("auth_token");
    if (!cookie) {
      return new Response(
        JSON.stringify({ success: false, message: "No auth token provided" }),
        { status: 401 }
      );
    }

    const token = cookie.value;

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("JWT verification failed:", err);
      return new Response(
        JSON.stringify({ success: false, message: "Invalid or expired token" }),
        { status: 401 }
      );
    }

    const { uniqueId } = await params;

    if (!uniqueId) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing uniqueId" }),
        { status: 400 }
      );
    }

    if (decoded.uniqueId !== uniqueId) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized access" }),
        { status: 403 }
      );
    }

    // 📌 PAGINATION LOGIC
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1; // default: page 1
    const limit = 5;
    const skip = (page - 1) * limit;

    // Count total data
    const totalCrops = await CropUpload.countDocuments({ uniqueId });

    // Fetch limited data
    const crops = await CropUpload.find({ uniqueId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Crops fetched successfully",
        page,
        limit,
        totalCrops,
        totalPages: Math.ceil(totalCrops / limit),
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
