// 'use server';
// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";

// export async function POST(req) {
//   await connectDB();
//   const { name, email, password, type } = await req.json();

//   // Check if user already exists
//   const existingUser = await User.findOne({ email, type });
//   if (existingUser) {
//     return NextResponse.json({ error: "User already exists" }, { status: 400 });
//   }

//   // Hash password
//   const hashedPassword = await bcrypt.hash(password, 10);

//   // Create user
//   const user = await User.create({
//     name,
//     email,
//     password: hashedPassword,
//     type,
//   });

//   return NextResponse.json({
//     message: "User registered successfully",
//     user: { id: user._id, name: user.name, email: user.email, type: user.type },
//   });
// }
'use server';
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Farmer from "@/models/Farmer";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();
  const { name, email, password, type } = await req.json();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    let model;
    if (type === "user") {
      model = User;
    } else if (type === "farmer") {
      model = Farmer;
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // Check if already exists
    const existing = await model.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: `A account already exists with this email as ${type}` },
        { status: 400 }
      );
    }

    const account = await model.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({
      message: `${type} registered successfully`,
      account: {
        id: account._id,
        name: account.name,
        email: account.email,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return NextResponse.json(
        { error: `Duplicate email detected for ${type}` },
        { status: 400 }
      );
    }

    console.error("Error registering:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
