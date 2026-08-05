import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CropSpecies from "@/models/CropSpecies";

export async function GET() {
  try {
    await connectDB();
    const species = await CropSpecies.find({});
    return NextResponse.json({ success: true, data: species });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { speciesList } = body;
    
    if (!speciesList || !Array.isArray(speciesList)) {
      return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
    }

    const results = [];
    for (const item of speciesList) {
      const updated = await CropSpecies.findOneAndUpdate(
        { speciesId: item.speciesId },
        { name: item.name },
        { upsert: true, new: true }
      );
      results.push(updated);
    }
    
    return NextResponse.json({ success: true, message: "Species uploaded successfully", data: results });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
