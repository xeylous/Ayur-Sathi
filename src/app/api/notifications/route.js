import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import jwt from "jsonwebtoken";

// GET /api/notifications
// Fetches all notifications for the logged-in user
export async function GET(req) {
  try {
    await connectDB();

    const cookie = req.cookies.get("auth_token");
    if (!cookie) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(cookie.value, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid Token" },
        { status: 403 }
      );
    }

    // Determine the user's ID
    const userId = decoded.uniqueId || decoded.labId || decoded.manuId;

    if (!userId) {
       return NextResponse.json(
        { success: false, message: "User ID not found in token" },
        { status: 400 }
      );
    }

    // Fetch notifications sorted by newest first
    const notifications = await Notification.find({ recipientId: userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await connectDB();

    // Authenticate user
    const cookie = req.cookies.get("auth_token");
    if (!cookie) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Validate token and get user info
    let decoded;
    try {
        decoded = jwt.verify(cookie.value, process.env.JWT_SECRET);
    } catch(err) {
         return NextResponse.json(
        { success: false, message: "Invalid Token" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Notification ID is required" },
        { status: 400 }
      );
    }

    const notification = await Notification.findById(id);

    if (!notification) {
      return NextResponse.json(
        { success: false, message: "Notification not found" },
        { status: 404 }
      );
    }

    // Check ownership
    // The recipientId should match the uniqueId (farmer/user) or labId or manuId from token
    const userId = decoded.uniqueId || decoded.labId || decoded.manuId;
    if (notification.recipientId !== userId) {
        return NextResponse.json(
            { success: false, message: "Forbidden: You do not own this notification" },
            { status: 403 }
        );
    }

    await Notification.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/notifications error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
