"use client";

import React, { useState, useEffect ,useRef} from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { speciesList } from "@/lib/cropdetails";
import { usePathname } from "next/navigation";


export default function UploadCrop() {
  // ---------- STATE ----------
  const [formData, setFormData] = useState({
    cropName: "",
    quantity: "", // store as STRING to fix increment/decrement issue
  });

  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(true);
const locationFetchedRef = useRef(false);
  const pathname = usePathname();
  const uniqueId = pathname.split("/").pop();

  // ---------- AUTO LOCATION FETCH ----------
useEffect(() => {
  if (locationFetchedRef.current) return; // Prevent double execution in strict mode
  locationFetchedRef.current = true;

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("⚠️ Geolocation not supported.");
      setDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        toast.success("📍 Auto-location detected!");
        setDetectingLocation(false);
      },
      () => {
        toast.warn("⚠️ Allow location access for auto-detection");
        setDetectingLocation(false);
      }
    );
  };

  detectLocation();
}, []);

  // ---------- FORM INPUT ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Keep the quantity as STRING so arrow-increase works properly
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ---------- MANUAL LOCATION FETCH ----------
  const handleLocation = () => {
    if (!navigator.geolocation) {
      toast.error("⚠️ Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const position = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setCoords(position);
        toast.success("📍 Location updated!");
      },
      () => {
        toast.error("❌ Failed to fetch location.");
      }
    );
  };

  // ---------- SUBMIT ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.cropName || !formData.quantity || !coords) {
      toast.error("⚠️ Please fill all fields and ensure location is set.");
      return;
    }

    const species = speciesList.find((item) => item.name === formData.cropName);

    if (!species) {
      toast.error("❌ Invalid crop selected.");
      return;
    }

    const payload = {
      gpsCoordinates: coords,
      timestamp: new Date().toISOString(),
      uniqueId,
      speciesId: species.speciesId,
      quantity: parseFloat(formData.quantity), // convert only here
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

      setFormData({ cropName: "", quantity: "" });
      setCoords(null);
    } catch (err) {
      toast.error("❌ Error uploading crop.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------
  // UI DESIGN — PROFESSIONAL + THEME-ALIGNED
  // ------------------------------------------------------------

  return (
    <div className="min-h-screen flex justify-center bg-[#ECF39E]/10 py-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-green-100 p-8">
        {/* TITLE */}
        <h1 className="text-3xl font-extrabold text-center text-green-800 mb-8">
          🌿 Upload Crop Details
        </h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {/* CROP NAME */}
          <div className="sm:col-span-2">
            <label className="text-gray-700 font-medium">Select Crop</label>
            <select
              name="cropName"
              value={formData.cropName}
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-green-600 focus:outline-none"
            >
              <option value="">-- Choose Crop --</option>
              {speciesList.map((crop, i) => (
                <option key={i} value={crop.name}>
                  {crop.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="text-gray-700 font-medium">Quantity (kg)</label>

            <div className="mt-1 flex items-center w-full border rounded-lg border-gray-300 overflow-hidden">
              {/* DECREASE BUTTON */}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: Math.max(
                      1,
                      Number(prev.quantity || 1) - 1
                    ).toString(),
                  }))
                }
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 font-bold text-xl text-gray-700"
              >
                –
              </button>

              {/* INPUT FIELD */}
              <input
                type="text"
                name="quantity"
                inputMode="numeric"
                value={formData.quantity}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, ""); // numeric only
                  setFormData((prev) => ({ ...prev, quantity: value }));
                }}
                className="w-full text-center p-3 focus:outline-none"
                placeholder="0"
              />

              {/* INCREASE BUTTON */}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: (Number(prev.quantity || 0) + 1).toString(),
                  }))
                }
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 font-bold text-xl text-gray-700"
              >
                +
              </button>
            </div>
          </div>

          {/* LOCATION */}
          <div className="sm:col-span-2">
            <label className="text-gray-700 font-medium">Location</label>

            <div className="flex items-center gap-4 mt-2">
              <button
                type="button"
                onClick={handleLocation}
                className="
                  px-5 py-2.5 rounded-lg 
                  bg-green-700 text-white font-semibold
                  hover:bg-green-800 transition shadow
                "
              >
                {detectingLocation ? "Detecting..." : "📍 Get Location Again"}
              </button>

              <span className="text-sm text-gray-600">
                {coords
                  ? `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(
                      4
                    )}`
                  : "Location not set"}
              </span>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="sm:col-span-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3 rounded-lg font-bold text-white
                bg-[#90A955] hover:bg-[#4F772D] 
                transition shadow-lg disabled:bg-gray-400
              "
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
