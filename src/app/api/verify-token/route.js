// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export async function GET(req) {
//   try {
//     const cookie = req.cookies.get("auth_token");

//     if (!cookie) {
//       return NextResponse.json({ success: false, user: null }, { status: 200 });
//     }

//     const token = cookie.value;

//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (err) {
//       return NextResponse.json({ success: false, user: null }, { status: 200 });
//     }

//     // Base response user object
//     let user = {
//       id: decoded.id,
//       email: decoded.email,
//       type: decoded.type,
//       uniqueId: decoded.uniqueId,
//     };

//     // Special case for lab
//     if (decoded.type === "farmer") {
//       user.labId = decoded.labId;
//     }

//     if (decoded.type === "lab") {
//       user.labId = decoded.labId;
//     }

//     // Special case for manufacturer
//     if (decoded.type === "manu") {
//       user.manuId = decoded.manuId;
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Token valid",
//       user,
//     });

//   } catch (err) {
//     console.error("VERIFY TOKEN ERROR:", err);
//     return NextResponse.json({ success: false, user: null }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";

// MODELS
import User from "@/models/User";
import Farmer from "@/models/Farmer";
import LabCredential from "@/models/LabCredential";
import ManufacturerCredential from "@/models/ManufacturerCredential";

export async function GET(req) {
  try {
    await connectDB();

    const cookie = req.cookies.get("auth_token");

    // No token found
    if (!cookie) {
      return NextResponse.json(
        { success: false, user: null },
        { status: 200 }
      );
    }

    const token = cookie.value;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, user: null },
        { status: 200 }
      );
    }

    const userType = decoded.type;
    let userData = null;

    // ---------------------------------------------------
    // 1️⃣ NORMAL USER
    // ---------------------------------------------------
    if (userType === "user") {
      userData = await User.findOne({ uniqueId: decoded.uniqueId }).lean();

      if (!userData)
        return NextResponse.json({ success: false, user: null }, { status: 200 });

      return NextResponse.json(
        {
          success: true,
          user: {
            type: "user",
            id: userData._id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            address: userData.address,
            pinCode: userData.pinCode,
            uniqueId: userData.uniqueId,
            verified: userData.verified,
          },
        },
        { status: 200 }
      );
    }

    // ---------------------------------------------------
    // 2️⃣ FARMER
    // ---------------------------------------------------
    if (userType === "farmer") {
      userData = await Farmer.findOne({ uniqueId: decoded.uniqueId }).lean();

      if (!userData)
        return NextResponse.json({ success: false, user: null }, { status: 200 });

      return NextResponse.json(
        {
          success: true,
          user: {
            type: "farmer",
            id: userData._id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            address: userData.address,
            pinCode: userData.pinCode,
            uniqueId: userData.uniqueId,
            verified: userData.verified,
          },
        },
        { status: 200 }
      );
    }

    // ---------------------------------------------------
    // 3️⃣ LAB
    // ---------------------------------------------------
    if (userType === "lab") {
      userData = await LabCredential.findOne({ labId: decoded.labId }).lean();

      if (!userData)
        return NextResponse.json({ success: false, user: null }, { status: 200 });

      return NextResponse.json(
        {
          success: true,
          user: {
            type: "lab",
            id: userData._id,
            labId: userData.labId,
            email: userData.email,
            active: userData.active,
            createdAt: userData.createdAt,
          },
        },
        { status: 200 }
      );
    }

    // ---------------------------------------------------
    // 4️⃣ MANUFACTURER
    // ---------------------------------------------------
    if (userType === "manu") {
      // Handle ManuId OR manuId (token inconsistencies)
      const manuId =
        decoded.ManuId ||
        decoded.manuId ||
        decoded.ManuID ||
        decoded.manufacturerId;

      userData = await ManufacturerCredential.findOne({
        ManuId: manuId,
      }).lean();

      if (!userData)
        return NextResponse.json({ success: false, user: null }, { status: 200 });

      return NextResponse.json(
        {
          success: true,
          user: {
            type: "manu",
            id: userData._id,
            manuId: userData.ManuId,
            email: userData.email,
            active: userData.active,
            createdAt: userData.createdAt,
          },
        },
        { status: 200 }
      );
    }

    // ---------------------------------------------------
    // 5️⃣ Unknown Type
    // ---------------------------------------------------
    return NextResponse.json(
      { success: false, user: null },
      { status: 200 }
    );

  } catch (err) {
    console.error("VERIFY TOKEN ERROR:", err);
    return NextResponse.json(
      { success: false, user: null },
      { status: 500 }
    );
  }
}
