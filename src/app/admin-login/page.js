"use client";
import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext"; // import your context

const REDIRECT_PATH = "/admin";

const AdminLoginPage = () => {
  const router = useRouter();
  const { adminLogin } = useAuth(); // get adminLogin from context

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await adminLogin(email, password, "central");

      if (result.success) {
        toast.success("Admin login successful!", { toastId: "login-success", autoClose: 3000 });

        // Redirect to /admin after short delay
        setTimeout(() => {
          router.push(REDIRECT_PATH);
        }, 1500);
      } else {
        toast.error("Admin login failed. Please check your credentials.", { toastId: "login-failure", autoClose: 3000 });
        setTimeout(() => {
          setIsSubmitting(false);
        }, 1500);
      }
    } catch (err) {
      console.error("Central Admin login error:", err);
      toast.error("Something went wrong. Please try again later.", { toastId: "login-error-unexpected", autoClose: 3000 });
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1500);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f5f8cc]/50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/logo.jpg"
            alt="AyurSaathi Logo"
            width={50}
            height={50}
            className="h-12 w-12 rounded-lg"
          />
          <h1 className="mt-4 text-2xl font-extrabold text-[#4F772D]">Central Admin Login</h1>
          <p className="text-sm text-gray-500 mt-1">Access the Central Control Panel</p>
        </div>

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
      </div>
    </div>
  );
};

export default AdminLoginPage;
