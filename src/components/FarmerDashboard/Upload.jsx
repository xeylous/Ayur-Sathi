"use client";

import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UploadCrop() {
  const [formData, setFormData] = useState({
    cropName: "",
    quantity: "",
    image: null,
    location: "",
  });

  const [crops, setCrops] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("farmerCrops")) || [];
    setCrops(saved);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = `${pos.coords.latitude}, ${pos.coords.longitude}`;
          setFormData({ ...formData, location: coords });
          toast.success("📍 Location fetched successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
        },
        () => {
          toast.error("⚠️ Failed to fetch location.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      );
    } else {
      toast.error("Geolocation not supported on this device.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.cropName || !formData.quantity || !formData.image) {
      toast.error("⚠️ Please fill in all fields before submitting.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const newCrop = {
      cropName: formData.cropName,
      quantity: formData.quantity,
      location: formData.location,
      image: formData.image ? formData.image.name : null,
      date: new Date().toLocaleDateString(),
    };

    const updatedCrops = [...crops, newCrop];
    setCrops(updatedCrops);
    localStorage.setItem("farmerCrops", JSON.stringify(updatedCrops));

    setFormData({
      cropName: "",
      quantity: "",
      image: null,
      location: "",
    });

    toast.success("✅ Crop uploaded successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  return (
    <div className="h-screen w-full flex items-start justify-center p-4 overflow-hidden">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-6 sm:p-10 overflow-hidden">
        <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
          🌾 Upload Crop Details
        </h1>

        {/* Upload Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {/* Crop Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Crop Name
            </label>
            <input
              type="text"
              name="cropName"
              value={formData.cropName}
              onChange={handleChange}
              className="mt-1 w-full border-b-2 border-gray-300 focus:border-green-600 focus:outline-none p-2 bg-transparent"
              placeholder="Enter crop name"
              required
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity (kg)
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="mt-1 w-full border-b-2 border-gray-300 focus:border-green-600 focus:outline-none p-2 bg-transparent"
              placeholder="Enter quantity"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 block w-full text-sm text-gray-600 
                file:mr-4 file:py-2 file:px-4 
                file:rounded-lg file:border-0 
                file:text-sm file:font-semibold 
                file:bg-green-600 file:text-white 
                hover:file:bg-green-700"
              required
            />
          </div>

          {/* Location */}
          <div className="sm:col-span-2 flex items-center gap-4">
            <button
              type="button"
              onClick={handleLocation}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              📍 Get Location
            </button>
            <span className="text-sm text-gray-600 truncate">
              {formData.location ? formData.location : "No location selected"}
            </span>
          </div>

          {/* Buttons */}
          <div className="sm:col-span-2 flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="flex-1 bg-[#90A955] text-white py-3 rounded-lg font-semibold hover:bg-[#4F772D] transition"
            >
              Upload Crop
            </button>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("farmerCrops");
                setCrops([]);
                toast.info("🗑️ All crop data cleared!", {
                  position: "top-right",
                  autoClose: 3000,
                });
              }}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-500 hover:text-white transition"
            >
              Clear All
            </button>
          </div>
        </form>

        {/* Crop History */}
        {crops.length > 0 && (
          <div className="mt-10 overflow-hidden">
            <h2 className="text-lg font-semibold text-green-700 mb-4">
              📜 Uploaded Crops History
            </h2>
            <ul className="space-y-3 text-sm overflow-hidden">
              {crops.map((crop, index) => (
                <li
                  key={index}
                  className="p-4 border rounded-lg shadow-sm flex justify-between items-center"
                >
                  <span>
                    🌱 <strong>{crop.cropName}</strong> – {crop.quantity}kg
                    <br />
                    <span className="text-gray-500 text-xs">
                      {crop.date} {crop.location && `| ${crop.location}`}
                    </span>
                  </span>
                  {crop.image && (
                    <span className="text-xs text-gray-600">📷 {crop.image}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Toast */}
      <ToastContainer />
    </div>
  );
}
