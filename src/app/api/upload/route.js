import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import multer from "multer";
import { Readable } from "stream";

const storage = multer.memoryStorage();
const upload = multer({ storage });

function bufferToStream(buffer) {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "ayursathi_docs", resource_type: "raw" }, // raw = PDFs
      (error, result) => {
        if (error) throw error;
      }
    );

    bufferToStream(buffer).pipe(uploadStream);

    return NextResponse.json({
      success: true,
      message: "File uploaded to Cloudinary",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
};
