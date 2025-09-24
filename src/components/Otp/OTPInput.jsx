"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function OTPPage({ length = 6, uniqueId, onClose }) {
  const router = useRouter();
  const [otp, setOtp] = useState(Array(length).fill(""));
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [message, setMessage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputsRef = useRef([]);

const sendOtp = async () => {
    try {
      const res = await fetch(`/api/send-otp/${uniqueId}`, { method: "POST" });
      const data = await res.json();
      setMessage(data.message || "✅ OTP sent successfully!");
    } catch (err) {
      setMessage("⚠️ Failed to send OTP. Please try again.");
    }
  };

  // Send OTP on mount
  useEffect(() => {
    if (uniqueId) sendOtp();
  }, [uniqueId])

  // Resend cooldown timer
  useEffect(() => {
    let interval;
    if (resendDisabled && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setResendDisabled(false);
      setTimer(30);
    }
    return () => clearInterval(interval);
  }, [resendDisabled, timer]);


  useEffect(() => {
    fetch(`/api/send-otp/${uniqueId}`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Failed to send OTP"));
  }, [uniqueId]);

  // 🔹 Verify OTP
  const handleVerify = async () => {
    if (disabled) return;
    setDisabled(true);

    try {
      const res = await fetch(`/api/verify-otp/${uniqueId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp: otp.join("") }),
    });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ OTP verified successfully! Redirecting...");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        const remaining = attemptsLeft - 1;
        setAttemptsLeft(remaining);
        setDisabled(false);

        if (remaining > 0) {
          setMessage(
            `❌ Incorrect OTP. You have ${remaining} attempt(s) left.`
          );
        } else {
          setMessage("❌ Registration failed. Redirecting...");
          setTimeout(() => router.push("/register"), 2000);
        }
      }
    } catch (err) {
      setMessage("⚠️ Server error. Please try again.");
      setDisabled(false);
    }
  };

  // 🔹 OTP box handlers
  const handleChange = (val, index) => {
    if (/^\d?$/.test(val)) {
      const newOtp = [...otp];
      newOtp[index] = val;
      setOtp(newOtp);
      if (val && index < length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // 🔹 Resend OTP
  const handleResend = () => {
    sendOtp();
    setResendDisabled(true);
    setTimer(30);
    setMessage("🔄 OTP resent. Please check your email/phone.");
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg border p-8 flex flex-col relative z-50">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute right-3 top-3 text-gray-500 hover:text-red-500"
      >
        ✕
      </button>

      {/* Logo + Title */}
      <div className="flex flex-col items-center mb-6">
        <Image
          src="/logo.jpg"
          alt="Logo"
          width={50}
          height={50}
          className="h-12 w-12 rounded-lg"
        />
        <h1 className="mt-3 text-2xl font-bold text-[#4F772D]">
          Verify Your Account
        </h1>
        <p className="text-sm text-gray-500">
          Enter the {length}-digit code we sent to your email/phone
        </p>
      </div>

      {/* Message */}
      {message && (
        <p className="mb-4 text-center text-sm font-medium text-gray-700">
          {message}
        </p>
      )}

      {/* OTP Inputs */}
      <motion.div
        className="flex justify-center gap-2 sm:gap-3 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {otp.map((digit, index) => (
          <motion.input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputsRef.current[index] = el)}
            disabled={disabled}
            whileFocus={{ scale: 1.1 }}
            className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-semibold rounded-lg border shadow-sm outline-none focus:ring-2 focus:ring-green-600"
          />
        ))}
      </motion.div>

      {/* Verify Button */}
      <button
        onClick={handleVerify}
        disabled={otp.some((d) => d === "") || disabled}
        className="w-full py-2.5 rounded-md text-white text-lg font-medium bg-[#90a955] hover:bg-[#4F772D] shadow-lg disabled:bg-gray-300"
      >
        Verify
      </button>

      {/* Resend Button */}
      <button
        onClick={handleResend}
        disabled={resendDisabled}
        className="mt-4 w-full py-2.5 rounded-md text-[#4F772D] font-medium border border-[#90a955] hover:bg-[#ECF39E] disabled:opacity-50"
      >
        {resendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
      </button>
    </div>
  );
}
