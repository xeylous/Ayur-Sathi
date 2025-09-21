import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Farmer from "@/models/Farmer";
import redis from "@/lib/redis";

export async function POST(req, context) {
  const { uniqueId } = await context.params;
  const { otp } = await req.json();

  try {
    await connectDB();

    const otpKey = `otp:${uniqueId}`;
    const attemptsKey = `otp_attempts:${uniqueId}`;

    // Fetch OTP and attempts from Redis
    const [storedOtp, attemptsLeftRaw] = await Promise.all([
      redis.get(otpKey),
      redis.get(attemptsKey),
    ]);

    const attemptsLeft = attemptsLeftRaw ? parseInt(attemptsLeftRaw) : 0;

    if (!storedOtp) {
      return NextResponse.json({ error: "OTP expired or not sent" }, { status: 400 });
    }

    if (storedOtp === otp) {
      // ✅ OTP correct → cleanup OTP keys
      await Promise.all([redis.del(otpKey), redis.del(attemptsKey)]);

      // ✅ Fetch pending user data from Redis
      const userDataRaw = await redis.get(`pending_user:${uniqueId}`);
      if (!userDataRaw) {
        return NextResponse.json(
          { error: "No pending registration found" },
          { status: 400 }
        );
      }

      const { name, email, password, type, uniqueId: uid } = JSON.parse(userDataRaw);

      // ✅ Select correct model
      let model;
      if (type === "user") {
        model = User;
      } else if (type === "farmer") {
        model = Farmer;
      } else {
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
      }

      // ✅ Save user to DB now
      const account = await model.create({
        name,
        email,
        password,
        type,
        uniqueId: uid,
        verified: true,
      });

      // ✅ Remove temp data from Redis
      await redis.del(`pending_user:${uniqueId}`);

      return NextResponse.json({
        message: "OTP verified successfully. Account created.",
        account: {
          uniqueId: account.uniqueId,
          name: account.name,
          email: account.email,
        },
      });
    } else {
      // ❌ Incorrect OTP → decrement attempts
      const remainingAttempts = attemptsLeft - 1;

      if (remainingAttempts <= 0) {
        await Promise.all([
          redis.del(otpKey),
          redis.del(attemptsKey),
          redis.del(`pending_user:${uniqueId}`), // cleanup registration too
        ]);
        return NextResponse.json({ error: "Registration failed" }, { status: 400 });
      } else {
        await redis.set(attemptsKey, remainingAttempts, "EX", 300);
        return NextResponse.json(
          { error: "Incorrect OTP", attemptsLeft: remainingAttempts },
          { status: 400 }
        );
      }
    }
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
