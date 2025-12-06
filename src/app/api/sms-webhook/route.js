import { NextResponse } from "next/server";

// Handle inbound SMS from Twilio
export async function POST(req) {
  const formData = await req.formData();
  const from = formData.get("From");   // Farmer's phone number
  const body = formData.get("Body");   // SMS content
  const to = formData.get("To");       // Your Twilio number

  console.log("📩 Incoming Crop SMS:", { from, to, body });

  // Always reply with a thank you message
  const reply = "🌱 Thanks for sharing your crop details! We have recorded it.";

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
