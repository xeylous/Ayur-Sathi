import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Farmer from "@/models/Farmer";
import User from "@/models/User";
import redis from "@/lib/redis";
import jwt from "jsonwebtoken";
import { sendRegistrationEmail } from "@/lib/mailer";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"; // ideally store in env

export async function POST(req, context) {
  const { uniqueId } = context.params;
  const { otp } = await req.json();

  try {
    await connectDB();

    const otpKey = `otp:${uniqueId}`;
    const attemptsKey = `otp_attempts:${uniqueId}`;

    const [storedOtp, attemptsLeftRaw] = await Promise.all([
      redis.get(otpKey),
      redis.get(attemptsKey),
    ]);

    const attemptsLeft = attemptsLeftRaw ? parseInt(attemptsLeftRaw) : 0;

    if (!storedOtp) {
      return NextResponse.json({ error: "OTP expired or not sent" }, { status: 400 });
    }

    if (storedOtp !== otp) {
      const remainingAttempts = attemptsLeft - 1;
      if (remainingAttempts <= 0) {
        await Promise.all([
          redis.del(otpKey),
          redis.del(attemptsKey),
          redis.del(`pending_user:${uniqueId}`),
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

    // ✅ OTP correct
    await Promise.all([redis.del(otpKey), redis.del(attemptsKey)]);

    const userDataRaw = await redis.get(`pending_user:${uniqueId}`);
    if (!userDataRaw) {
      return NextResponse.json({ error: "No pending registration found" }, { status: 400 });
    }

    const { name, email, password, type } = JSON.parse(userDataRaw);

    let model;
    if (type === "user") model = User;
    else if (type === "farmer") model = Farmer;
    else return NextResponse.json({ error: "Invalid type" }, { status: 400 });

    const account = await model.create({
      name,
      email,
      password,
      type,
      uniqueId,
      verified: true,
    });

    await redis.del(`pending_user:${uniqueId}`);

    // Send welcome mail
    await sendRegistrationEmail({
      name: account.name,
      email: account.email,
      logo: "https://ayur-sathi.vercel.app/_next/image?url=%2Flogo.jpg&w=640&q=75",
      loginUrl: "https://ayur-sathi.vercel.app/login",
      supportUrl: "https://ayur-sathi.vercel.app/explore",
    });

    // ✅ Generate JWT for automatic login
    const token = jwt.sign(
      { id: account._id, email: account.email, type: account.type },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Determine redirect URL
    let redirectUrl = type === "farmer" ? `/${uniqueId}/cropUpload` : `/${uniqueId}/`;

    // ✅ Return success + login token
    return NextResponse.json({
      message: "OTP verified successfully. Account created and logged in.",
      account: {
        uniqueId: account.uniqueId,
        name: account.name,
        email: account.email,
        type: account.type,
      },
      token,
      redirectUrl,
    });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
