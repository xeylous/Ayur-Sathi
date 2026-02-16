
// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import User from "@/models/User";
// import Farmer from "@/models/Farmer";
// import LabCredential from "@/models/LabCredential";
// import ManufacturerCredential from "@/models/ManufacturerCredential";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export async function POST(req) {
//   try {
//     await connectDB();

//     let { email, password, type } = await req.json();

//     // basic validation
//     if (!email || !password || !type) {
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });
//     }

//     // normalize
//     email = String(email).toLowerCase().trim();
//     type = String(type).toLowerCase().trim();

//     // map account type -> model
//     const modelMap = {
//       user: User,
//       farmer: Farmer,
//       lab: LabCredential,
//       manu : ManufacturerCredential,
//     };

//     const model = modelMap[type];
//     if (!model) {
//       return NextResponse.json({ error: "Invalid account type" }, { status: 400 });
//     }

//     // find account in the selected collection
//     const account = await model.findOne({ email });
//     // console.log("account",account);
//     if (!account) {
//       return NextResponse.json({ error: `${type} not found` }, { status: 404 });
//     }

//     // make sure the same email isn't registered in any other account collection
//     const conflicts = [];
//     if (type !== "user") {
//       const u = await User.findOne({ email });
//       if (u) conflicts.push("user");
//     }
//     if (type !== "farmer") {
//       const f = await Farmer.findOne({ email });
//       if (f) conflicts.push("farmer");
//     }
//     if (type !== "lab") {
//       const l = await LabCredential.findOne({ email });
//       if (l) conflicts.push("lab");
//     }
//     if (type !== "manu") {
//       const l = await LabCredential.findOne({ email });
//       if (l) conflicts.push("manu");
//     }
//     if (conflicts.length > 0) {
//       return NextResponse.json(
//         {
//           error: `This email is already registered as a different account type (${conflicts.join(", ")})`,
//         },
//         { status: 403 }
//       );
//     }

//     // choose the correct hashed password field (lab uses hashedPassword in your original code)
//     const hashedField = type === "lab" ? "hashedPassword" : "password";
//     const hashed = account[hashedField];

//     if (!hashed) {
//       // defensive: if the expected hashed field doesn't exist, fail safely
//       return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
//     }

//     const isMatch = await bcrypt.compare(password, hashed);
//     if (!isMatch) {
//       return NextResponse.json({ error: "Invalid credentials", message: "password mismatch" }, { status: 401 });
//     }

//     // create token
//     let token;
//     if (type === "lab") {
//       token = jwt.sign(
//         {
//           id: account._id,
//           email: account.email,
//           type,
//           labId: account.labId,
//         },
//         process.env.JWT_SECRET,
//         { expiresIn: "9h" }
//       );
//     } else {
//     if (type === "manu") {
//       token = jwt.sign(
//         {
//           id: account._id,
//           email: account.email,
//           type,
//           ManuId: account.labId,
//         },
//         process.env.JWT_SECRET,
//         { expiresIn: "9h" }
//       );
//     } else {
//       token = jwt.sign(
//         {
//           id: account._id,
//           email: account.email,
//           type,
//           uniqueId: account.uniqueId,
//         },
//         process.env.JWT_SECRET,
//         { expiresIn: "9h" }
//       );
//     }

//     // determine redirect
//     let redirectUrl;
//     if (type === "lab") {
//   redirectUrl = `/labId/${account.labId}`;
// } else if (type === "manu") {
//   redirectUrl = `/manuId/${account.ManuId}`;
// } else {
//   redirectUrl = `/id/${account.uniqueId || account._id}`;
// }
// let response;
// // console.log("type",type);
//     if (type === "lab") {
//       response = NextResponse.json(
//         {
//           message: "Login successful",
//           redirectUrl,
//           account: {
//             labId: account.labId,
//             name: account.name,
//             email: account.email,
//             type,
//           },
//         },
//         { status: 200 }

//       );
//     if (type === "manu") {
//       response = NextResponse.json(
//         {
//           message: "Login successful",
//           redirectUrl,
//           account: {
//             labId: account.ManuId,
//             name: account.name,
//             email: account.email,
//             type,
//           },
//         },
//         { status: 200 }

//       );
//     // console.log("token",response.account);

//     } else {
//       response = NextResponse.json(
//         {
//           message: "Login successful",
//           redirectUrl,
//           account: {
//             name: account.name,
//             email: account.email,
//             uniqueId: account.uniqueId || account._id,
//             type,
//           },
//         },
//         { status: 200 }
//       );
//     }
//     // console.log("token", response.account);

//     // set cookie
//     response.cookies.set("auth_token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//       maxAge: 60 * 60, // seconds
//     });

//     return response;
//   } catch (error) {
//     console.error("Login error:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Farmer from "@/models/Farmer";
import LabCredential from "@/models/LabCredential";
import ManufacturerCredential from "@/models/ManufacturerCredential";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    let { email, password, type, rememberMe } = await req.json();

    if (!email || !password || !type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    email = String(email).toLowerCase().trim();
    type = String(type).toLowerCase().trim();

    // Model map
    const modelMap = {
      user: User,
      farmer: Farmer,
      lab: LabCredential,
      manu: ManufacturerCredential,
    };

    const model = modelMap[type];
    if (!model) {
      return NextResponse.json({ error: "Invalid account type" }, { status: 400 });
    }

    // Find in correct model
    const account = await model.findOne({ email });
    if (!account) {
      return NextResponse.json({ error: `${type} not found` }, { status: 404 });
    }

    // Email conflict check
    const conflicts = [];
    if (type !== "user" && await User.findOne({ email })) conflicts.push("user");
    if (type !== "farmer" && await Farmer.findOne({ email })) conflicts.push("farmer");
    if (type !== "lab" && await LabCredential.findOne({ email })) conflicts.push("lab");
    if (type !== "manu" && await ManufacturerCredential.findOne({ email })) conflicts.push("manu");

    if (conflicts.length > 0) {
      return NextResponse.json(
        { error: `Email already registered as: ${conflicts.join(", ")}` },
        { status: 403 }
      );
    }

    // Password field handling
    const hashedField = ["lab", "manu"].includes(type) ? "hashedPassword" : "password";
    const hashed = account[hashedField];

    if (!hashed) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, hashed);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT
    let tokenPayload = { id: account._id, email: account.email, type };

    if (type === "lab") tokenPayload.labId = account.labId;
    if (type === "manu") tokenPayload.manuId = account.ManuId;
    if (["user", "farmer"].includes(type)) tokenPayload.uniqueId = account.uniqueId;

    // 🕰️ Determine session duration
    const expiresIn = rememberMe ? "30d" : "9h";
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 9 * 60 * 60;

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn });

    // Redirect logic
    let redirectUrl;
    if (type === "lab") redirectUrl = `/labId/${account.labId}`;
    else if (type === "manu") redirectUrl = `/manuId/${account.ManuId}`;
    else redirectUrl = `/id/${account.uniqueId || account._id}`;

    // Build response payload
    const responsePayload = {
      message: "Login successful",
      redirectUrl,
      account: {
        name: account.name,
        email: account.email,
        type,
      },
    };

    if (type === "lab") responsePayload.account.labId = account.labId;
    if (type === "manu") responsePayload.account.manuId = account.ManuId;
    if (["user", "farmer"].includes(type))
      responsePayload.account.uniqueId = account.uniqueId || account._id;

    const response = NextResponse.json(responsePayload, { status: 200 });

    // Cookie
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge, 
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
