"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Import species mapping list
import { speciesList } from "../../lib/cropdetails";



import { usePathname } from "next/navigation";



export default function UploadCrop() {
  const [formData, setFormData] = useState({
    cropName: "",
    image: null,
    quantity: "",
  });

  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);

  const pathname = usePathname(); // e.g., "/id/d284fa"
  const uniqueId = pathname.split("/").pop(); // "d284fa"


  

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Get location coordinates
  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const position = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
          setCoords(position);
          toast.success("📍 Location fetched successfully!");
        },
        () => {
          toast.error("❌ Failed to fetch location.");
        }
      );
    } else {
      toast.error("⚠️ Geolocation not supported on this device.");
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.cropName || !formData.quantity || !coords) {
      toast.error("⚠️ Please fill all fields and get location first.");
      return;
    }

    // Find speciesId using cropName
    const species = speciesList.find((item) => item.name === formData.cropName);
    if (!species) {
      toast.error("Invalid crop name selected.");
      return;
    }

    const payload = {
      gpsCoordinates: coords,
      timestamp: new Date().toISOString(),
      uniqueId: uniqueId, // temporary unique id
      speciesId: species.speciesId,
      quantity: parseFloat(formData.quantity),
    };

    try {
      setLoading(true);
      const response = await fetch("/api/cropUploaded", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Upload failed");

      toast.success("✅ Crop uploaded successfully!");
      setFormData({
        cropName: "",
        image: null,
        quantity: "",
      });
      setCoords(null);
    } catch (err) {
      toast.error("❌ Error uploading crop.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-[#ECF39E]/10 py-5 px-4 ">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6 sm:p-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
          🌾 Upload Crop Details
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Crop Name (Dropdown) */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Crop
            </label>
            <select
              name="cropName"
              value={formData.cropName}
              onChange={handleChange}
              className="mt-1 w-full border-b-2 border-gray-300 focus:border-green-600 focus:outline-none p-2 bg-transparent"
              required
            >
              <option value="">-- Select Crop --</option>
              {speciesList.map((crop, i) => (
                <option key={i} value={crop.name}>
                  {crop.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity (in kg)
            </label>
            <input
              type="number"
              step="0.1"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              className="mt-1 w-full border-b-2 border-gray-300 focus:border-green-600 focus:outline-none p-2 bg-transparent"
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
              {coords
                ? `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`
                : "No location selected"}
            </span>
          </div>

          {/* Submit */}
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                loading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-[#90A955] hover:bg-[#4F772D] text-white"
              }`}
            >
              {loading ? "Uploading..." : "Upload Crop"}
            </button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
}
