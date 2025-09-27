"use client";

import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FarmerProfile() {
  const [farmer, setFarmer] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    pinCode: "",
  });

  // Load saved data from localStorage
  useEffect(() => {
    const savedFarmer = localStorage.getItem("farmerProfile");
    if (savedFarmer) {
      setFarmer(JSON.parse(savedFarmer));
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFarmer({ ...farmer, [e.target.name]: e.target.value });
  };

  // Save data to localStorage
  const handleSave = () => {
    if (
      !farmer.fullName ||
      !farmer.phone ||
      !farmer.email ||
      !farmer.address ||
      !farmer.pinCode
    ) {
      toast.error("⚠️ Please fill in all fields before saving.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    localStorage.setItem("farmerProfile", JSON.stringify(farmer));
    toast.success("✅ Farmer details saved successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  return (
    <div className="max-h-screen flex items-center justify-center py-6">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-6 sm:p-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
          Farmer Profile
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
              value={farmer.fullName}
              onChange={handleChange}
              className="mt-1 w-full border-b-2 border-gray-300 focus:border-green-600 focus:outline-none p-2 bg-transparent"
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
              value={farmer.phone}
              onChange={handleChange}
              className="mt-1 w-full border-b-2 border-gray-300 focus:border-green-600 focus:outline-none p-2 bg-transparent"
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
              value={farmer.email}
              onChange={handleChange}
              className="mt-1 w-full border-b-2 border-gray-300 focus:border-green-600 focus:outline-none p-2 bg-transparent"
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
              value={farmer.pinCode}
              onChange={handleChange}
              className="mt-1 w-full border-b-2 border-gray-300 focus:border-green-600 focus:outline-none p-2 bg-transparent"
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
              value={farmer.address}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full border-b-2 border-gray-300 focus:border-green-600 focus:outline-none p-2 bg-transparent resize-none"
              placeholder="Enter address"
            />
          </div>

          {/* Buttons (full width always) */}
        <div className="sm:col-span-2 flex gap-4">
  <button
    type="button"
    onClick={handleSave}
    className="flex-1 text-base font-medium text-black hover:text-white bg-[#90A955] hover:bg-[#4F772D] py-3 rounded-lg text-center transition"
  >
    Save
  </button>

  <button
    type="button"
    onClick={() => {
      localStorage.removeItem("farmerProfile");
      setFarmer({
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
    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-500 hover:text-white transition"
  >
    Clear
  </button>
</div>

        </form>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
