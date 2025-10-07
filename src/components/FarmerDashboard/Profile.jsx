"use client";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { usePathname } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

export default function FarmerProfile() {
  const pathname = usePathname(); // e.g. /id/d284fa
  const uniqueId = pathname.split("/").pop();

  const [farmer, setFarmer] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    pinCode: "",
  });

  // ✅ Page load pe data fetch karna
 useEffect(() => {
  const fetchProfile = async () => {
    try {
      const tokenRes = await fetch("/api/verify-token", { method: "GET" });
      const tokenData = await tokenRes.json();
      const userType = tokenData.user.type; // farmer ya user
      const email = tokenData.user.email;

      const res = await fetch(`/api/profile?type=${userType}`); // ✅ type as query param
      const data = await res.json();

      if (res.ok && data.success && data.profile) {
        setFarmer({
          fullName: data.profile.name || "",
          phone: data.profile.phone || "",
          email: email || "",
          address: data.profile.address || "",
          pinCode: data.profile.pinCode || "",
          uniqueId: uniqueId,
          type: userType,
        });
      } else {
        toast.info("No existing profile found, please fill your details.");
      }
    } catch (error) {
     
      toast.error("Failed to load profile data!");
    }
  };

  fetchProfile();
}, [uniqueId]);


  // ✅ Input change
  const handleChange = (e) => {
    setFarmer({ ...farmer, [e.target.name]: e.target.value });
  };

  // ✅ Save / Update profile
  const handleSave = async () => {
    const { fullName, phone, email, address, pinCode } = farmer;

    if (!fullName || !phone || !email || !address || !pinCode) {
      toast.error("Please fill all fields!");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone number must be 10 digits!");
      return;
    }

    if (!/^\d{6}$/.test(pinCode)) {
      toast.error("Pincode must be 6 digits!");
      return;
    }

    const payload = { uniqueId, ...farmer };

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile!");
      }
    } catch (error) {
     
      toast.error("Error saving profile!");
    }
  };

  return (
    <div className="flex items-center justify-center py-6 m-3">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-6 sm:p-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
          Farmer Profile
        </h1>

        <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={farmer.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              className="mt-1 w-full border-b-2 border-gray-300 focus:border-green-600 p-2"
            />
          </div>

          <div>
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={farmer.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="mt-1 w-full border-b-2 border-gray-300 focus:border-green-600 p-2"
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={farmer.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="mt-1 w-full border-b-2 border-gray-300 focus:border-green-600 p-2"
              readOnly
            />
          </div>

          <div>
            <label>Pin Code</label>
            <input
              type="text"
              name="pinCode"
              value={farmer.pinCode}
              onChange={handleChange}
              placeholder="Enter pin code"
              className="mt-1 w-full border-b-2 border-gray-300 focus:border-green-600 p-2"
            />
          </div>

          <div className="sm:col-span-2">
            <label>Address</label>
            <textarea
              name="address"
              value={farmer.address}
              onChange={handleChange}
              rows={2}
              placeholder="Enter address"
              className="mt-1 w-full border-b-2 border-gray-300 focus:border-green-600 p-2 resize-none"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={handleSave}
              className="w-full py-3 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
}
