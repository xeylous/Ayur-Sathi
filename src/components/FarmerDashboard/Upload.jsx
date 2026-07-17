"use client";

import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { speciesList } from "@/lib/cropdetails";
import { usePathname } from "next/navigation";
import {
  Upload,
  MapPin,
  Leaf,
  ImagePlus,
  X,
  Loader2,
  Package,
  Minus,
  Plus,
} from "lucide-react";

export default function UploadCrop() {
  // ---------- STATE ----------
  const [formData, setFormData] = useState({
    cropName: "",
    quantity: "",
  });

  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(true);

  // Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const locationFetchedRef = useRef(false);
  const pathname = usePathname();
  const uniqueId = pathname.split("/").pop();

  // ---------- AUTO LOCATION FETCH ----------
  useEffect(() => {
    if (locationFetchedRef.current) return;
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ---------- IMAGE HANDLERS ----------
  const handleImageSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("❌ Please select an image file (JPG, PNG, etc.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("❌ Image must be smaller than 5 MB");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleImageSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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

    // Build FormData for multipart submission
    const payload = new FormData();
    payload.append("speciesId", species.speciesId);
    payload.append("quantity", formData.quantity);
    payload.append("latitude", coords.latitude.toString());
    payload.append("longitude", coords.longitude.toString());
    payload.append("timestamp", new Date().toISOString());
    payload.append("uniqueId", uniqueId);

    if (imageFile) {
      payload.append("cropImage", imageFile);
    }

    try {
      setLoading(true);

      const response = await fetch("/api/cropUploaded", {
        method: "POST",
        body: payload,
      });

      if (!response.ok) throw new Error("Upload failed");

      toast.success("✅ Crop uploaded successfully!");

      setFormData({ cropName: "", quantity: "" });
      setCoords(null);
      removeImage();
    } catch (err) {
      toast.error("❌ Error uploading crop.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------
  // UI — PREMIUM AYURSAATHI THEME
  // ------------------------------------------------------------

  return (
    <div className="flex justify-center bg-[#f8fae3]/30 py-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-[#90A955]/15 p-8">
        {/* TITLE */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#90A955]/15 text-[#4F772D] font-bold text-xs uppercase tracking-wider mb-3 border border-[#90A955]/25">
            <Leaf className="w-4 h-4" />
            Farm Upload
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#31572C]">
            Upload Crop Details
          </h1>
          <p className="text-sm text-[#4F772D]/60 mt-1">
            Record your harvest with image, location, and quantity
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {/* CROP NAME */}
          <div className="sm:col-span-2">
            <label className="text-[#31572C] font-semibold text-sm flex items-center gap-1.5 mb-1.5">
              <Package className="w-4 h-4 text-[#90A955]" />
              Select Crop
            </label>
            <select
              name="cropName"
              value={formData.cropName}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl border-[#90A955]/25 bg-[#f8fae3]/20 focus:ring-2 focus:ring-[#90A955] focus:border-[#90A955] focus:outline-none text-[#31572C] text-sm transition-all"
            >
              <option value="">-- Choose Crop --</option>
              {speciesList.map((crop, i) => (
                <option key={i} value={crop.name}>
                  {crop.name}
                </option>
              ))}
            </select>
          </div>

          {/* CROP IMAGE UPLOAD */}
          <div className="sm:col-span-2">
            <label className="text-[#31572C] font-semibold text-sm flex items-center gap-1.5 mb-1.5">
              <ImagePlus className="w-4 h-4 text-[#90A955]" />
              Crop Photo
              <span className="text-[#4F772D]/40 font-normal text-xs ml-1">(optional, max 5 MB)</span>
            </label>

            {imagePreview ? (
              /* Image Preview */
              <div className="relative w-full rounded-xl overflow-hidden border border-[#90A955]/25 bg-[#f8fae3]/20">
                <img
                  src={imagePreview}
                  alt="Crop preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-red-50 text-gray-500 hover:text-red-600 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-3">
                  <span className="text-white text-xs font-semibold drop-shadow">
                    {imageFile?.name}
                  </span>
                </div>
              </div>
            ) : (
              /* Drop Zone */
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  w-full h-48 rounded-xl border-2 border-dashed cursor-pointer
                  flex flex-col items-center justify-center gap-2 transition-all duration-200
                  ${isDragging
                    ? "border-[#4F772D] bg-[#ECF39E]/30 scale-[1.01]"
                    : "border-[#90A955]/30 bg-[#f8fae3]/20 hover:border-[#90A955]/60 hover:bg-[#ECF39E]/10"
                  }
                `}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isDragging ? "bg-[#4F772D]/15" : "bg-[#90A955]/10"}`}>
                  <ImagePlus className={`w-6 h-6 ${isDragging ? "text-[#4F772D]" : "text-[#90A955]"}`} />
                </div>
                <span className="text-sm font-semibold text-[#4F772D]">
                  {isDragging ? "Drop image here" : "Click or drag image here"}
                </span>
                <span className="text-xs text-[#4F772D]/40">
                  JPG, PNG, WebP up to 5 MB
                </span>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageSelect(e.target.files?.[0])}
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="text-[#31572C] font-semibold text-sm flex items-center gap-1.5 mb-1.5">
              <Package className="w-4 h-4 text-[#90A955]" />
              Quantity (kg)
            </label>

            <div className="flex items-center w-full border rounded-xl border-[#90A955]/25 overflow-hidden bg-[#f8fae3]/20">
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
                className="px-4 py-3 bg-[#ECF39E]/40 hover:bg-[#ECF39E]/70 font-bold text-xl text-[#4F772D] transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>

              {/* INPUT FIELD */}
              <input
                type="text"
                name="quantity"
                inputMode="numeric"
                value={formData.quantity}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setFormData((prev) => ({ ...prev, quantity: value }));
                }}
                className="w-full text-center p-3 focus:outline-none bg-transparent text-[#31572C] font-semibold"
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
                className="px-4 py-3 bg-[#ECF39E]/40 hover:bg-[#ECF39E]/70 font-bold text-xl text-[#4F772D] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* LOCATION */}
          <div className="sm:col-span-2">
            <label className="text-[#31572C] font-semibold text-sm flex items-center gap-1.5 mb-1.5">
              <MapPin className="w-4 h-4 text-[#90A955]" />
              Location
            </label>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleLocation}
                className="
                  px-5 py-2.5 rounded-xl 
                  bg-[#4F772D] text-white font-semibold text-sm
                  hover:bg-[#31572C] transition-all shadow-sm
                  flex items-center gap-2 cursor-pointer
                "
              >
                <MapPin className="w-4 h-4" />
                {detectingLocation ? "Detecting..." : "Refresh Location"}
              </button>

              <span className="text-sm text-[#4F772D]/70 font-mono">
                {coords
                  ? `${coords.latitude.toFixed(4)}°, ${coords.longitude.toFixed(4)}°`
                  : "Location not set"}
              </span>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="sm:col-span-2 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3.5 rounded-xl font-bold text-white text-sm
                bg-gradient-to-r from-[#4F772D] to-[#31572C]
                hover:from-[#31572C] hover:to-[#4F772D]
                transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#4F772D]/15
                disabled:from-gray-400 disabled:to-gray-400 disabled:shadow-none
                flex items-center justify-center gap-2 cursor-pointer
              "
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Crop
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
