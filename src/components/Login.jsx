"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const { setUser } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState("user");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const dropdownRef = useRef(null);

  const labelMap = {
    user: "User Login",
    farmer: "Farmer Login",
    lab: "Lab Login",
    manu: "Manufacturer Login",
    admin: "Admin Login",
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset fields when switching mode
  useEffect(() => {
    setEmail("");
    setUserId("");
    setPassword("");
    setShowPassword(false);
    setIsSubmitting(false);
  }, [mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    // 🧩 Admin Login (local validation)
    if (mode === "admin") {
      if (email === "risuraj162@gmail.com" && password === "1234") {
        toast.success("Admin login successful", { autoClose: 1500 });
        setTimeout(() => router.push("http://localhost:3000/admin"), 800);
      } else {
        toast.error("Invalid admin credentials", { autoClose: 1500 });
        setTimeout(() => setIsSubmitting(false), 1500);
      }
      return;
    }

    // 🧩 Other login types (API call)
    const payload = { email, password, type: mode, rememberMe };
    // console.log(payload);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Wrong credentials", { autoClose: 1500 });
        setTimeout(() => setIsSubmitting(false), 1500);
        return;
      }

      setUser({
        name: data.account.name,
        labId: data.account.labId || null,
        email: data.account.email || null,
        userId: data.account.userId || null,
        manuId: data.account.manuId || null,
        uniqueId: data.account.uniqueId || null,
        type: data.account.type,
      });
      console.log("hello");
      // console.log("Apurv",User);

      // console.log(User);

      toast.success("Login successful", { autoClose: 1500 });
      setTimeout(() => router.push(data.redirectUrl), 500);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again", {
        autoClose: 1500,
      });
      setTimeout(() => setIsSubmitting(false), 1500);
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
              : mode === "farmer"
              ? "Login to your Farmer account"
              : mode === "lab"
              ? "Login to your Lab account"
              : mode === "manu"
              ? "Login to your Manufacturer account"
              : "Admin access panel"}
          </p>
        </div>

        {/* 🔽 Custom Dropdown */}
        <div className="mb-6 relative" ref={dropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Login Type
          </label>
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full px-3 py-2 rounded-md border bg-white text-left focus:outline-none focus:ring-2 focus:ring-[#90a955] flex justify-between items-center"
          >
            <span>{labelMap[mode]}</span>
            <ChevronDown
              size={20}
              className={`text-gray-500 transition-transform duration-200 ${
                showDropdown ? "rotate-180" : ""
              }`}
            />
          </button>
          {showDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg">
              {["user", "farmer", "lab", "manu", "admin"].map((m) => (
                <div
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setShowDropdown(false);
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-[#90a955] hover:text-white transition"
                >
                  {labelMap[m]}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Login Form */}
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
            {/* Email / Username */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {mode === "admin" ? "Admin Username" : "Email Address"}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2 rounded-md border bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder={
                  mode === "admin" ? "Enter admin username" : "you@example.com"
                }
                autoComplete="username"
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
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-[#90a955] focus:ring-[#90a955] border-gray-300 rounded cursor-pointer accent-[#90a955]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 cursor-pointer">
                Keep me signed in
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 rounded-md text-white text-lg font-medium shadow-lg cursor-pointer ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#90a955] hover:bg-[#4F772D] focus:ring-4 focus:outline-none focus:ring-green-300"
              }`}
            >
              {isSubmitting
                ? "Logging in..."
                : `Login as ${mode.charAt(0).toUpperCase() + mode.slice(1)}`}
            </button>
          </motion.form>
        </AnimatePresence>

        {/* OR Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Auth */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/google-callback" })}
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
          Don&apos;t have an account?{" "}
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
