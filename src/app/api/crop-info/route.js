import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CropInfo from "@/models/CropInfo";

export async function GET() {
  try {
    await connectDB();
    const info = await CropInfo.find({});
    return NextResponse.json({ success: true, data: info });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { infoList } = body;
    
    if (!infoList || !Array.isArray(infoList)) {
      return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
    }

    const results = [];
    for (const item of infoList) {
      const updated = await CropInfo.findOneAndUpdate(
        { speciesId: item.speciesId },
        { 
          name: item.name,
          image: item.image,
          uses: item.uses,
          benefits: item.benefits,
          disadvantages: item.disadvantages
        },
        { upsert: true, new: true }
      );
      results.push(updated);
    }
    
    return NextResponse.json({ success: true, message: "Crop info uploaded successfully", data: results });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
