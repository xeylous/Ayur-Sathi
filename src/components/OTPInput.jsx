"use client";

import { useState, useRef, useEffect } from "react";

export default function OTPInput({ length = 6, onComplete, disabled = false }) {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);

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
      const newOtp = pasteData.split("").concat(Array(length).fill("")).slice(0, length);
      setOtp(newOtp);
      const lastIndex = newOtp.findIndex((d) => d === "");
      if (lastIndex === -1) inputsRef.current[length - 1].focus();
      else inputsRef.current[lastIndex].focus();

      if (newOtp.every((d) => d !== "")) onComplete?.(newOtp.join(""));
    }
  };

  return (
    <div className="flex justify-center gap-3 mt-4">
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
          className={`w-12 h-14 text-center text-xl border-2 rounded-lg outline-none transition-all ${
            disabled
              ? "border-gray-300 bg-gray-100 cursor-not-allowed"
              : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          }`}
        />
      ))}
    </div>
  );
}
