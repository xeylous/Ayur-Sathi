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
    
    if (body.infoList && Array.isArray(body.infoList)) {
      const results = [];
      for (const item of body.infoList) {
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
      return NextResponse.json({ success: true, message: "Bulk upload successful", data: results });
    }

    const { name, speciesId, image, uses, benefits, disadvantages } = body;
    if (!name || !speciesId || !image) {
      return NextResponse.json({ success: false, message: "Name, speciesId, and image are required" }, { status: 400 });
    }

    const newItem = await CropInfo.create({ name, speciesId, image, uses, benefits, disadvantages });
    return NextResponse.json({ success: true, message: "Crop info added", data: newItem });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ success: false, message: "Species ID already exists" }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { _id, name, speciesId, image, uses, benefits, disadvantages } = body;
    
    if (!_id) {
      return NextResponse.json({ success: false, message: "Missing _id" }, { status: 400 });
    }

    const updated = await CropInfo.findByIdAndUpdate(
      _id,
      { name, speciesId, image, uses, benefits, disadvantages },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return NextResponse.json({ success: false, message: "Crop info not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Crop info updated", data: updated });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ success: false, message: "Species ID already exists" }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const id = req.nextUrl.searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ success: false, message: "Missing id parameter" }, { status: 400 });
    }

    const deleted = await CropInfo.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Crop info not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Crop info deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
