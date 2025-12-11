// app/api/test-pusher/route.js
import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";

export async function GET(req) {
  try {
    const channel = "farmer-Crop-Notification";
    const event = "crop-status";
    const payload = {
      type: "LAB_ACCEPTED",
      batchId: "TEST-BATCH-123",
      status: "Approved",
      message: "Test notification from server",
      timestamp: Date.now(),
    };

    const res = await pusherServer.trigger(channel, event, payload);
    console.log("test-pusher trigger result:", res);
    return NextResponse.json({ success: true, channel, event, res });
  } catch (err) {
    console.error("test-pusher error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
