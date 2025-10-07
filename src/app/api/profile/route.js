// 'use server';
// import { connectDB } from "@/lib/db";
// import Farmer from "@/models/Farmer";
// import User from "@/models/User";

// export async function POST(req) {
//   try {
//     await connectDB();

//     const { uniqueId, fullName, phone, email, address, pinCode, type } = await req.json();

//     if (!uniqueId || !type) {
//       return new Response(
//         JSON.stringify({ error: "uniqueId and type are required" }),
//         { status: 400 }
//       );
//     }

//     // Choose the correct model
//     const Model = type === "farmer" ? Farmer : User;

//     // Update or create the profile
//     const updatedProfile = await Model.findOneAndUpdate(
//       { uniqueId },
//       {
//         name: fullName,
//         phone,
//         email,
//         address,
//         pinCode
//       },
//       { new: true, upsert: true } // create if not exists
//     );

//     return new Response(
//       JSON.stringify({ success: true, message : "Profile updated successfully" }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error(error);
//     return new Response(
//       JSON.stringify({ error: "Something went wrong" }),
//       { status: 500 }
//     );
//   }
// }
'use server';
import { connectDB } from "@/lib/db";
import Farmer from "@/models/Farmer";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();

    // 🔹 1. Get token from cookies
    const cookie = req.cookies.get("auth_token");
    if (!cookie) {
      return new Response(
        JSON.stringify({ error: "No auth token provided" }),
        { status: 401 }
      );
    }

    const token = cookie.value;

    // 🔹 2. Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("JWT verification failed:", err);
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401 }
      );
    }

    // 🔹 3. Extract query params (if you want to allow specifying type)
    const url = new URL(req.url);
    const type = url.searchParams.get("type") || "user"; // default to "user"

    // 🔹 4. Choose model dynamically
    const Model = type === "farmer" ? Farmer : User;

    // 🔹 5. Fetch the user's profile
    const userProfile = await Model.findOne({ uniqueId: decoded.uniqueId }).lean();
    

    if (!userProfile) {
      return new Response(
        JSON.stringify({ error: "Profile not found" }),
        { status: 404 }
      );
    }

    // 🔹 6. Return profile
    return new Response(
      JSON.stringify({ success: true, profile: userProfile }),
      { status: 200 }
    );
  } catch (error) {
    
    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    // 🔹 1. Get token from cookies
    const cookie = req.cookies.get("auth_token");
    if (!cookie) {
      return new Response(
        JSON.stringify({ error: "No auth token provided" }),
        { status: 401 }
      );
    }

    const token = cookie.value;
    // console.log("Token from cookie:", token);
    
    // 🔹 2. Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
     
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401 }
      );
    }

    // 🔹 3. Extract body data
    const { uniqueId, fullName, phone, email, address, pinCode, type } = await req.json();

    if (!uniqueId || !type) {
      return new Response(
        JSON.stringify({ error: "uniqueId and type are required" }),
        { status: 400 }
      );
    }

    // 🔹 4. Optional: ensure user can only update their own profile
    if (decoded.uniqueId !== uniqueId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: mismatched user" }),
        { status: 403 }
      );
    }

    // 🔹 5. Choose model dynamically
    const Model = type === "farmer" ? Farmer : User;

    // 🔹 6. Build update object safely
    const updateFields = {};
    if (fullName !== undefined) updateFields.name = fullName;
    if (phone !== undefined) updateFields.phone = phone;
    if (email !== undefined) updateFields.email = email;
    if (address !== undefined) updateFields.address = address;
    if (pinCode !== undefined) updateFields.pinCode = pinCode;

    // 🔹 7. Update or create (safe upsert)
    await Model.findOneAndUpdate(
      { uniqueId },
      { $set: updateFields },
      { new: true, upsert: true }
    );

    return new Response(
      JSON.stringify({ success: true, message: "Profile updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    
    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    );
  }
}
