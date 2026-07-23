
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

  // Load saved data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("userProfile");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Save data to localStorage
  const handleSave = () => {
    if (
      !user.fullName ||
      !user.phone ||
      !user.email ||
      !user.address ||
      !user.pinCode
    ) {
      toast.error("⚠️ Please fill in all fields before saving.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    localStorage.setItem("userProfile", JSON.stringify(user));
    toast.success("✅ User details saved successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-6 px-2 sm:px-4">
      <div className="w-full max-w-4xl bg-white/95 border border-[#90A955]/20 shadow-xl rounded-2xl p-6 sm:p-10">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-[#31572C]">
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
              className="mt-1 w-full border-b-2 border-gray-300 focus:border-[#31572C] focus:outline-none p-2 bg-transparent transition-colors"
              placeholder="Enter full name"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className="mt-1 w-full border-b-2 border-gray-300 focus:border-[#31572C] focus:outline-none p-2 bg-transparent transition-colors"
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
              onChange={handleChange}
              className="mt-1 w-full border-b-2 border-gray-300 focus:border-[#31572C] focus:outline-none p-2 bg-transparent transition-colors"
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
              name="pinCode"
              value={user.pinCode}
              onChange={handleChange}
              className="mt-1 w-full border-b-2 border-gray-300 focus:border-[#31572C] focus:outline-none p-2 bg-transparent transition-colors"
              placeholder="Enter pin code"
            />
          </div>

          {/* Address (full width always) */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              name="address"
              value={user.address}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full border-b-2 border-gray-300 focus:border-[#31572C] focus:outline-none p-2 bg-transparent resize-none transition-colors"
              placeholder="Enter address"
            />
          </div>

          {/* Buttons */}
          <div className="sm:col-span-2 flex flex-col sm:flex-row gap-4 mt-4">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 text-base font-bold text-white bg-[#31572C] hover:bg-[#4F772D] py-3.5 rounded-xl text-center shadow-md hover:shadow-lg transition cursor-pointer"
            >
              Save Details
            </button>

            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("userProfile");
                setUser({
                  fullName: "",
                  phone: "",
                  email: "",
                  address: "",
                  pinCode: "",
                });
                toast.info("Profile data cleared!", {
                  position: "top-right",
                  autoClose: 3000,
                });
              }}
              className="flex-1 bg-[#ECF39E]/30 text-[#31572C] border border-[#90A955]/20 hover:bg-[#90A955]/20 py-3.5 rounded-xl font-bold transition cursor-pointer"
            >
              Clear Data
            </button>
          </div>
        </form>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

