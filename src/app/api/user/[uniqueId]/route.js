import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Farmer from "@/models/Farmer";

export async function GET(req, context) {
  const { uniqueId } = context.params;
  await connectDB();

  const user = await User.findOne({ uniqueId }) || await Farmer.findOne({ uniqueId });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({
    name: user.name,
    email: user.email,
    uniqueId: user.uniqueId,
  });
}
