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
    
    // Bulk insert handling (legacy support for migration)
    if (body.speciesList && Array.isArray(body.speciesList)) {
      const results = [];
      for (const item of body.speciesList) {
        const updated = await CropSpecies.findOneAndUpdate(
          { speciesId: item.speciesId },
          { name: item.name },
          { upsert: true, new: true }
        );
        results.push(updated);
      }
      return NextResponse.json({ success: true, message: "Bulk upload successful", data: results });
    }

    // Single insert handling
    const { name, speciesId } = body;
    if (!name || !speciesId) {
      return NextResponse.json({ success: false, message: "Name and speciesId are required" }, { status: 400 });
    }

    const newItem = await CropSpecies.create({ name, speciesId });
    return NextResponse.json({ success: true, message: "Species added", data: newItem });
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
    const { _id, name, speciesId } = body;
    
    if (!_id) {
      return NextResponse.json({ success: false, message: "Missing _id" }, { status: 400 });
    }

    const updated = await CropSpecies.findByIdAndUpdate(
      _id,
      { name, speciesId },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return NextResponse.json({ success: false, message: "Species not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Species updated", data: updated });
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

    const deleted = await CropSpecies.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Species not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Species deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
