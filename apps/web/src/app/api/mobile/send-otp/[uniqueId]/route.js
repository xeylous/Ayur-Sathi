import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import nodemailer from "nodemailer";

// ✅ Define CORS headers once
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // or restrict later
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// ✅ Handle preflight request (important!)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req, context) {
  const { uniqueId } = await context.params;

  try {
    // ✅ Get pending user data from Redis
    const userDataRaw = await redis.get(`pending_user:${uniqueId}`);
    if (!userDataRaw) {
      return NextResponse.json({ error: "User not found or registration expired" }, { status: 404 , headers: corsHeaders  });
    }

    const user = JSON.parse(userDataRaw);

    const otpKey = `otp:${uniqueId}`;
    const attemptsKey = `otp_attempts:${uniqueId}`;

    // 🔹 Check if OTP already exists
    const existingOtp = await redis.get(otpKey);
    if (existingOtp) {
      return NextResponse.json({ message: "OTP already sent. Please check your email." });
    }

    // 🔹 Generate new 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 🔹 Store OTP and attempts in Redis (5 min expiry)
    await redis.set(otpKey, otp, "EX", 300); // OTP expires in 5 minutes
    await redis.set(attemptsKey, 3, "EX", 300); // 3 attempts max

    // ✅ Gmail SMTP transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password recommended
      },
    });

    // 🔹 Send OTP email
    await transporter.sendMail({
      from: `"AyurSaathi" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Your OTP Code",
      text: `Hello ${user.name},\n\nYour OTP is ${otp}. It will expire in 5 minutes.\n\nThank you!`,
    });

    return NextResponse.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 , headers: corsHeaders   });
  }
}
