"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";


export default function LoginPage() {
  const { setUser } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState("user"); // "user" | "farmer"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Reset inputs when switching between User/Farmer
  useEffect(() => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
  }, [mode]);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, type: mode }),
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Login failed");
      return;
    }

    // ✅ Update AuthContext immediately
     setUser({
      name: data.account.name,
      email: data.account.email,
      uniqueId: data.account.uniqueId,
    });

    toast.success("Login successful");

    // Redirect
    setTimeout(() => {
      router.push(data.redirectUrl);
    }, 500);

  } catch (error) {
    console.error("Login error:", error);
    toast.error("Something went wrong. Please try again");
  }
};



  return (
    <div className="flex justify-center bg-[#f5f8cc]/50 px-4 py-10 md:py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border p-8 min-h-[650px]">
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
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500">
            {mode === "user"
              ? "Login to your User account"
              : "Login to your Farmer account"}
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
            User Login
          </button>
          <button
            onClick={() => setMode("farmer")}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition cursor-pointer ${
              mode === "farmer"
                ? "bg-[#90a955] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Farmer Login
          </button>
        </div>

        {/* Form with Smooth Animation */}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2 rounded-md border bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2 rounded-md border bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-md text-white text-lg font-medium bg-[#90a955] hover:bg-[#4F772D] focus:ring-4 focus:outline-none focus:ring-green-300 shadow-lg cursor-pointer"
            >
              {mode === "user" ? "Login as User" : "Login as Farmer"}
            </button>
          </motion.form>
        </AnimatePresence>

        {/* OR Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Auth Button */}
        <button
          onClick={() => toast.info("Google Auth coming soon!!")}
          className="w-full py-2.5 rounded-md border flex items-center justify-center gap-2 text-gray-700 bg-white hover:bg-gray-50 shadow-sm cursor-pointer"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-green-600 hover:underline font-medium cursor-pointer"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
