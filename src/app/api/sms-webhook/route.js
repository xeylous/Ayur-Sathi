import { NextResponse } from "next/server";

// This will handle inbound SMS from Twilio
export async function POST(req) {
  const formData = await req.formData();
  const from = formData.get("From");   // sender's phone number
  const body = formData.get("Body");   // SMS text content
  const to = formData.get("To");       // your Twilio number

  console.log("📩 Incoming SMS:", { from, to, body });

  // Example: check if it's OTP or crop details
  let reply = "Thanks for your message!";
  if (body.toLowerCase().includes("otp")) {
    reply = "✅ OTP received successfully!";
  } else if (body.toLowerCase().includes("crop")) {
    reply = "🌱 Crop details recorded on blockchain!";
  }

  // Twilio expects TwiML XML as response
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
     <Response>
       <Message>${reply}</Message>
     </Response>`,
    {
      headers: { "Content-Type": "text/xml" },
    }
  );
}
