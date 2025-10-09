import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import nodemailer from "nodemailer";

export async function POST(req, context) {
  const { uniqueId } = await context.params;

  try {
    // ✅ Get pending user data from Redis
    const userDataRaw = await redis.get(`pending_user:${uniqueId}`);
    if (!userDataRaw) {
      return NextResponse.json(
        { error: "User not found or registration expired" },
        { status: 404 }
      );
    }

    const user = JSON.parse(userDataRaw);

    const otpKey = `otp:${uniqueId}`;
    const attemptsKey = `otp_attempts:${uniqueId}`;

    // 🔹 Always delete old OTP before generating new one
    await Promise.all([redis.del(otpKey), redis.del(attemptsKey)]);

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
      subject: "Your Resent OTP Code",
      text: `Hello ${user.name},\n\nYour new OTP is ${otp}. It will expire in 5 minutes.\n\nThank you!`,
    });

    return NextResponse.json({ message: "New OTP sent to your email" });
  } catch (err) {
    console.error("Error resending OTP:", err);
    return NextResponse.json(
      { error: "Failed to resend OTP" },
      { status: 500 }
    );
  }
}
