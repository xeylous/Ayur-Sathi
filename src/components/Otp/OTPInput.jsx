"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function OTPPage({ length = 6, onComplete, disabled = false }) {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);
  const router = useRouter();

  useEffect(() => {
    if (disabled) return;
  }, [disabled]);

  const handleChange = (e, index) => {
    if (disabled) return;
    const value = e.target.value;

    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < length - 1) inputsRef.current[index + 1].focus();

      if (newOtp.every((digit) => digit !== "")) {
        onComplete?.(newOtp.join(""));
      }
    } else if (value === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleKeyDown = (e, index) => {
    if (disabled) return;
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputsRef.current[index - 1].focus();
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
      if (lastIndex === -1) inputsRef.current[length - 1].focus();
      else inputsRef.current[lastIndex].focus();

      if (newOtp.every((d) => d !== "")) onComplete?.(newOtp.join(""));
    }
  };

  const handleVerify = () => {
    if (otp.some((digit) => digit === "")) {
      toast.error("Please enter the complete code");
      return;
    }
    toast.success("OTP Verified!");
    setTimeout(() => router.push("/"), 1000);
  };

  return (
    <div className="flex justify-center bg-[#f5f8cc]/50 px-4 py-10 md:py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border p-8 min-h-[500px] flex flex-col items-center">
        
        {/* Icon */}
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#90a955]/10 mb-4">
          <span className="text-[#4F772D] text-2xl font-bold">🔑</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-[#4F772D] mb-2">
          Verify Your Account
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter the 6-digit verification code sent to your registered number.
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-2 sm:gap-3 flex-wrap mb-6">
          {otp.map((digit, index) => (
            <input
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
              className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-medium rounded-md border transition-all shadow-sm
                ${
                  disabled
                    ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                    : "border-gray-300 text-[#31572C] focus:border-[#90a955] focus:ring-2 focus:ring-[#90a955]/50"
                }`}
            />
          ))}
        </div>

        {/* Resend Option */}
        <p className="text-sm text-gray-600 mb-6">
          Didn’t get the code?{" "}
          <button
            type="button"
            className="text-[#90a955] font-medium hover:underline"
            onClick={() => toast.info("OTP resent!")}
          >
            Resend
          </button>
        </p>

        {/* Verify Button */}
        <button
          type="button"
          onClick={handleVerify}
          disabled={otp.some((digit) => digit === "")}
          className={`w-full py-2.5 rounded-md text-white text-lg font-medium shadow-md transition
            ${
              otp.every((digit) => digit !== "")
                ? "bg-[#90a955] hover:bg-[#4F772D] focus:ring-4 focus:outline-none focus:ring-green-300"
                : "bg-gray-300 cursor-not-allowed"
            }`}
        >
          Verify
        </button>
      </div>
    </div>
  );
}
