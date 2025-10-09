"use client";
import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext"; // import your context

// Mock Admin Credentials
const ADMIN_EMAIL = "admin@ayursaathi.com";
const ADMIN_PASSWORD = "admin123";
const REDIRECT_PATH = "/admin";

const AdminLoginPage = () => {
  const router = useRouter();
  const { adminLogin } = useAuth(); // get adminLogin from context

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginStatus, setLoginStatus] = useState({ success: false, message: "" });

  useEffect(() => {
    if (loginStatus.message) {
      const timer = setTimeout(() => {
        setLoginStatus({ success: false, message: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loginStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setLoginStatus({ success: false, message: "Verifying credentials..." });

    // Simulate small delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setLoginStatus({
        success: true,
        message: "Login successful! Redirecting...",
      });

      // ✅ Set admin token in context
      adminLogin("mock-admin-token"); // you can replace this with a real token if needed

      // Redirect to /admin after short delay
      setTimeout(() => {
        router.push(REDIRECT_PATH);
      }, 1200);
    } else {
      setLoginStatus({
        success: false,
        message: "Invalid Admin Email or Password.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f5f8cc]/50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo.jpg"
            alt="AyurSaathi Logo"
            width={50}
            height={50}
            className="h-12 w-12 rounded-lg"
          />
          <h1 className="mt-4 text-2xl font-extrabold text-[#4F772D]">Admin Login</h1>
          <p className="text-sm text-gray-500 mt-1">Access the Control Panel</p>
        </div>

        {loginStatus.message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm font-medium ${
              loginStatus.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {loginStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#90a955]"
              placeholder="admin@ayursaathi.com"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#90a955] pr-12"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl text-white font-semibold shadow-md flex justify-center ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#4F772D] hover:bg-[#6A994E]"
            }`}
          >
            {isSubmitting ? "Authenticating..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Hint: {ADMIN_EMAIL} / {ADMIN_PASSWORD}
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
