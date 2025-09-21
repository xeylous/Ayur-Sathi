

"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function OTPPage({ length = 6 }) {
  const { uniqueId } = useParams();
  const router = useRouter();
  const [otp, setOtp] = useState(Array(length).fill(""));
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [message, setMessage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const inputsRef = useRef([]);

  // 🔹 Send OTP on mount
  useEffect(() => {
    fetch(`/api/send-otp/${uniqueId}`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Failed to send OTP"));
  }, [uniqueId]);

  // 🔹 Handle OTP verification
  const handleVerify = async () => {
    if (disabled) return;
    setDisabled(true);

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
        setMessage(`❌ Incorrect OTP. You have ${remaining} attempt(s) left.`);
      } else {
        setMessage("❌ Registration failed. Redirecting...");
        setTimeout(() => router.push("/register"), 2000);
      }
    }
  };

  // 🔹 OTP Input Handlers
  const handleChange = (e, index) => {
    if (disabled) return;

    const value = e.target.value;

    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < length - 1) inputsRef.current[index + 1]?.focus();

    } else if (value === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleKeyDown = (e, index) => {
    if (disabled) return;


    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();

    }
  };

  const handlePaste = (e) => {
    if (disabled) return;
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim().slice(0, length);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = pasteData
        .split("")
        .concat(Array(length).fill(""))
        .slice(0, length);

      setOtp(newOtp);

      const lastIndex = newOtp.findIndex((d) => d === "");
      if (lastIndex === -1) inputsRef.current[length - 1]?.focus();
      else inputsRef.current[lastIndex]?.focus();
    }
  };

  return (
    <div className="flex justify-center bg-[#f5f8cc]/50 px-4 py-10 md:py-8 min-h-screen">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border p-8 flex flex-col">
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

        {/* Status Message */}
        {message && (
          <p className="mb-4 text-center text-sm font-medium text-gray-700">
            {message}
          </p>
        )}

        {/* OTP Input Boxes */}
        <motion.div
          className="flex justify-center gap-2 sm:gap-3 mb-8"
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
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              ref={(el) => (inputsRef.current[index] = el)}
              disabled={disabled}

              whileFocus={{ scale: 1.1 }}
              className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-semibold rounded-lg border shadow-sm outline-none transition-all
                ${
                  disabled
                    ? "border-gray-300 bg-gray-100 cursor-not-allowed text-gray-400"
                    : "border-gray-300 bg-white focus:border-green-600 focus:ring-2 focus:ring-green-600"
                }`}
            />
          ))}
        </motion.div>

        {/* Submit Button */}
        <button
          onClick={handleVerify}
          disabled={otp.some((d) => d === "") || disabled}
          className={`w-full py-2.5 rounded-md text-white text-lg font-medium shadow-lg transition
            ${
              otp.some((d) => d === "") || disabled
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#90a955] hover:bg-[#4F772D] focus:ring-4 focus:outline-none focus:ring-green-300"

            }`}
        >
          Verify
        </button>


        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Didn’t receive the code?{" "}
          <button
            type="button"
            onClick={() =>
              fetch(`/api/send-otp/${uniqueId}`, { method: "POST" })
                .then((res) => res.json())
                .then((data) => setMessage(data.message))
                .catch(() => setMessage("Failed to resend OTP"))
            }
            disabled={disabled}
            className="text-green-600 hover:underline font-medium cursor-pointer disabled:cursor-not-allowed disabled:text-gray-400"
          >
            Resend
          </button>
        </p>

      </div>
    </div>
  );
}
