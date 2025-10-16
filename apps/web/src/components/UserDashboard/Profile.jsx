"use client";

import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserProfile() {
  const [user, setUser] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    pinCode: "",
  });

  const [uniqueId, setUniqueId] = useState("");
  const [isEditing, setIsEditing] = useState(false); // 🔧 for edit mode

  // ✅ Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Step 1️⃣: Verify token
        const tokenRes = await fetch("/api/verify-token", { method: "GET" });
        const tokenData = await tokenRes.json();

        if (!tokenRes.ok || !tokenData?.user) {
          toast.error("⚠️ Session expired. Please log in again.");
          return;
        }

        const userType = tokenData.user.type || "user";
        const email = tokenData.user.email;
        const id = tokenData.user.uniqueId;

        setUniqueId(id);

        // Step 2️⃣: Fetch profile details
        const res = await fetch(`/api/profile?type=${userType}`, {
          method: "GET",
        });
        const data = await res.json();

        if (res.ok && data.success && data.profile) {
          setUser({
            fullName: data.profile.name || "",
            phone: data.profile.phone || "",
            email: email || "",
            address: data.profile.address || "",
            pinCode: data.profile.pinCode || "",
          });
        } else {
          toast.info("📝 No profile found. Please fill in your details.");
        }
      } catch (err) {
        console.error("Profile fetch failed:", err);
        toast.error("❌ Failed to load user profile.");
      }
    };

    fetchProfile();
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // ✅ Save / Update profile
  const handleSave = async () => {
    const { fullName, phone, email, address, pinCode } = user;

    if (!fullName || !phone || !email || !address || !pinCode) {
      toast.error("⚠️ Please fill all fields!");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("📞 Phone number must be 10 digits!");
      return;
    }

    if (!/^\d{6}$/.test(pinCode)) {
      toast.error("📍 Pincode must be 6 digits!");
      return;
    }

    const payload = { uniqueId, type: "user", ...user };

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("✅ Profile updated successfully!");
        setIsEditing(false); // Lock form again
      } else {
        toast.error(data.error || "❌ Failed to update profile.");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      toast.error("⚠️ Error saving profile!");
    }
  };

  return (
    <div className="max-h-screen flex items-center justify-center py-6 m-3">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-6 sm:p-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
          User Profile
        </h1>

        <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={user.fullName}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-1 w-full border-b-2 ${
                isEditing
                  ? "border-green-600 focus:border-green-700"
                  : "border-gray-300 bg-gray-100 cursor-not-allowed"
              } focus:outline-none p-2 bg-transparent`}
              placeholder="Enter full name"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              inputMode="numeric"
              name="phone"
              value={user.phone}
              maxLength={10}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-1 w-full border-b-2 ${
                isEditing
                  ? "border-green-600 focus:border-green-700"
                  : "border-gray-300 bg-gray-100 cursor-not-allowed"
              } focus:outline-none p-2 bg-transparent`}
              placeholder="Enter phone number"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              disabled
              className="mt-1 w-full border-b-2 border-gray-300 cursor-not-allowed p-2 bg-transparent"
              placeholder="Enter email"
            />
          </div>

          {/* Pin Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pin Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              name="pinCode"
              value={user.pinCode}
              maxLength={6}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-1 w-full border-b-2 ${
                isEditing
                  ? "border-green-600 focus:border-green-700"
                  : "border-gray-300 bg-gray-100 cursor-not-allowed"
              } focus:outline-none p-2 bg-transparent`}
              placeholder="Enter pin code"
            />
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              name="address"
              value={user.address}
              onChange={handleChange}
              disabled={!isEditing}
              rows={3}
              className={`mt-1 w-full border-b-2 ${
                isEditing
                  ? "border-green-600 focus:border-green-700"
                  : "border-gray-300 bg-gray-100 cursor-not-allowed"
              } focus:outline-none p-2 bg-transparent resize-none`}
              placeholder="Enter address"
            />
          </div>

          {/* Buttons */}
          <div className="sm:col-span-2 flex gap-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={!isEditing}
              className={`flex-1 text-base font-medium ${
                isEditing
                  ? "text-black hover:text-white bg-[#90A955] hover:bg-[#4F772D]"
                  : "text-gray-400 bg-gray-200 cursor-not-allowed"
              } py-3 rounded-lg text-center transition`}
            >
              Save
            </button>

            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${
                isEditing
                  ? "bg-gray-400 text-white hover:bg-gray-500"
                  : "bg-yellow-400 text-black hover:bg-yellow-500"
              }`}
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>
        </form>
      </div>

      {/* Toasts */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
