"use client";

import { useState, useEffect } from "react";
import { useFarmer } from "@/context/FarmerContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FarmerProfile() {
  const { farmer, setFarmer, loadingFarmer } = useFarmer();

  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    pinCode: "",
    uniqueId: "",
  });

  const [originalForm, setOriginalForm] = useState(null); // for cancel + comparison

  // Load form data from context
  useEffect(() => {
    if (farmer) {
      const initial = {
        fullName: farmer.name || "",
        phone: farmer.phone || "",
        email: farmer.email || "",
        address: farmer.address || "",
        pinCode: farmer.pinCode || "",
        uniqueId: farmer.uniqueId || "",
      };

      setForm(initial);
      setOriginalForm(initial);
    }
  }, [farmer]);

  // Check if form is modified
  const formChanged =
    originalForm &&
    JSON.stringify(form) !== JSON.stringify(originalForm);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Cancel button → revert changes + exit edit mode
  const handleCancel = () => {
    setForm(originalForm);
    setEditMode(false);
  };

  // Save Profile
  const handleSave = async () => {
    if (!formChanged) return;

    const payload = { ...form };

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Profile updated successfully!");

        // Update context
        setFarmer({
          ...farmer,
          name: form.fullName,
          phone: form.phone,
          address: form.address,
          pinCode: form.pinCode,
        });

        setOriginalForm(form); // update original reference
        setEditMode(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (err) {
      toast.error("Error updating profile");
    }
  };

  // Skeleton Loader
  if (loadingFarmer) {
    return (
      <div className="animate-pulse max-w-3xl mx-auto p-6 mt-10">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-6 bg-gray-300 rounded w-full mb-3"></div>
        <div className="h-6 bg-gray-300 rounded w-full mb-3"></div>
        <div className="h-6 bg-gray-300 rounded w-full mb-3"></div>
        <div className="h-20 bg-gray-300 rounded w-full"></div>
      </div>
    );
  }

  if (!farmer) {
    return <p className="text-center mt-10">No profile found.</p>;
  }

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
              value={form.fullName}
              onChange={handleChange}
              disabled={!editMode}
              className="mt-1 w-full border-b-2 border-gray-300 p-2 focus:border-green-600 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={!editMode}
              className="mt-1 w-full border-b-2 border-gray-300 p-2 focus:border-green-600 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              disabled
              className="mt-1 w-full border-b-2 bg-gray-100 border-gray-300 p-2"
            />
          </div>

          <div>
            <label>Pin Code</label>
            <input
              type="text"
              name="pinCode"
              value={form.pinCode}
              onChange={handleChange}
              disabled={!editMode}
              className="mt-1 w-full border-b-2 border-gray-300 p-2 focus:border-green-600 disabled:bg-gray-100"
            />
          </div>

          <div className="sm:col-span-2">
            <label>Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              disabled={!editMode}
              rows={2}
              className="mt-1 w-full border-b-2 border-gray-300 p-2 resize-none focus:border-green-600 disabled:bg-gray-100"
            />
          </div>
        </form>

        {/* BUTTONS AT BOTTOM */}
        <div className="flex justify-end gap-4 mt-10">

          {/* Cancel Button */}
          {editMode && (
            <button
              onClick={handleCancel}
              className="px-6 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-100 transition"
            >
              Cancel
            </button>
          )}

          {/* Edit / Update Button */}
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={!formChanged}
              className={`px-6 py-2 rounded-lg text-white transition ${
                formChanged
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Update Profile
            </button>
          )}
        </div>

      </div>

      <ToastContainer />
    </div>
  );
}
