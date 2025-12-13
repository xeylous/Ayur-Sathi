"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import OTPPage from "@/components/Otp/OTPInput";

export default function RegisterPage() {
  const [mode, setMode] = useState("user");
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [uniqueId, setUniqueId] = useState(null);

  // Reset form whenever mode changes
  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setShowPassword(false);
    setShowConfirm(false);
    setError("");
  }, [mode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill all required fields.");
      return;
    }

    setError("");
    setLoading(true);

    const { confirmPassword, ...safeData } = formData;
    const payload = { ...safeData, type: mode };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log("Registration response data:", data);

      if (!res.ok) {
        setError(data?.error || data?.message || "Registration failed");
        setLoading(false);
        return;
      }

      // ✅ Instead of router.push, open OTP overlay
      const id = data.userData.uniqueId;
      setUniqueId(id);
      setOtpModalOpen(true);

    } catch (err) {
      console.error("Register error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <div className="relative flex justify-center bg-[#f5f8cc]/50 px-4 py-6 md:mb-0">
      {/* Register Form */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border p-8 h-[850px] overflow-y-auto relative z-10">
        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/logo.jpg"
            alt="AyurSaathi Logo"
            width={50}
            height={50}
            className="h-12 w-12 rounded-lg"
          />
          <h1 className="mt-3 text-2xl font-bold text-[#4F772D]">
            Create Account
          </h1>
          <p className="text-sm text-gray-500">
            {mode === "user" ? "Register as a User" : "Register as a Farmer"}
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("user")}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition cursor-pointer ${
              mode === "user"
                ? "bg-[#90a955] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            User Register
          </button>
          <button
            onClick={() => setMode("farmer")}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition cursor-pointer ${
              mode === "farmer"
                ? "bg-[#90a955] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Farmer Register
          </button>
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.form
            key={mode}
            onSubmit={handleSubmit}
            className="space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type={showConfirm ? "text" : "password"}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-9 text-gray-500"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-600 text-sm font-medium text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-md text-white text-lg font-medium bg-[#90a955] hover:bg-[#4F772D] focus:ring-4 focus:outline-none focus:ring-green-300 shadow-lg cursor-pointer disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : mode === "user"
                ? "Register as User"
                : "Register as Farmer"}
            </button>
          </motion.form>
        </AnimatePresence>

        {/* Divider
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div> */}

        {/* Google Auth */}
        {/* <button
          onClick={() => signIn("google")}
          className="w-full py-2.5 cursor-pointer rounded-md border flex items-center justify-center gap-2 text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button> */}

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-green-600 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>

      {/* OTP Overlay */}
      <AnimatePresence>
        {otpModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              <OTPPage uniqueId={uniqueId} onClose={() => setOtpModalOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
