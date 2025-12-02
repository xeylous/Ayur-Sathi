import crypto from "crypto";
import CropUpload from "@/models/CropUpload";
import { connectDB } from "@/lib/db"; 

const ENCRYPTION_KEY = process.env.NEXTAUTH_SECRET.padEnd(32, "0");
const IV_LENGTH = 16;

// Encrypt helper
function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);

  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");

  return iv.toString("base64") + ":" + encrypted;
}

export async function GET(req, { params }) {
  await connectDB();
 
  const { batchId } =await params;
  console.log(batchId);

  const batch = await CropUpload.findOne(
    { batchId },
    {
      batchId: 1,
      status: 1,
      speciesId: 1,
      rejectionReason: 1,
      certificate: 1,
      updatedAt: 1,
    }
  );

  if (!batch) {
    return Response.json(
      { encrypted: encrypt(JSON.stringify({ message: "Batch not found" })) },
      { status: 404 }
    );
  }

  let responseData = {
    batchId: batch.batchId,
    status: batch.status,
    speciesId: batch.speciesId,
    lastUpdated: new Date(batch.updatedAt).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  }),
  };

  if (batch.status === "Approved") {
    responseData.certificateUrl = batch.certificate?.url || null;
  } else if (batch.status === "Rejected") {
    responseData.rejectionReason = batch.rejectionReason || "Not Provided";
  }

  const encryptedPayload = encrypt(JSON.stringify(responseData));

  return Response.json({
    encrypted: encryptedPayload,
    timestamp: new Date(),
  });
}
