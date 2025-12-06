"use client";
import React, { useState } from "react";
import {
  QrCode,
  Upload,
  ClipboardList,
  CheckCheck,
  FlaskConical,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LogProcessing = () => {
  const [certificationStatus, setCertificationStatus] = useState(null);

  const showToast = (message, type = "info") => {
    if (type === "success") toast.success(message);
    else if (type === "error") toast.error(message);
    else toast.info(message);
  };

  const handleCertify = async (e) => {
    e.preventDefault();

    const id = e.target.processBatchId.value.trim().toUpperCase();
    const finalStatus = e.target.qaResult.value;
    const file = e.target.certificate.files[0];
    const note = e.target.note.value.trim();

    const tests = {
      moisture: e.target.moisture.value.trim(),
      purity: e.target.purity.value.trim(),
      ph: e.target.ph.value.trim(),
    };

    // ✅ Validate all fields
    if (
      !id ||
      !file ||
      !tests.moisture ||
      !tests.purity ||
      !tests.ph ||
      finalStatus === "Pending"
    ) {
      showToast("⚠️ Please fill all fields and upload a certificate!", "error");
      return;
    }

    try {
      showToast("Submitting data... Please wait ⏳");

      const formData = new FormData();
      formData.append("batchId", id);
      formData.append("status", finalStatus);
      formData.append("note", note || "No additional notes");
      formData.append("tests", JSON.stringify(tests));
      formData.append("certificate", file);

      const response = await fetch("/api/accepted-batch", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        showToast(`✅ Batch ${id} ${finalStatus.toUpperCase()} successfully!`, "success");

        // ✅ Clear form fields after success
        e.target.reset();
      } else {
        showToast(result.message || "❌ Something went wrong!", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("🚫 Failed to submit. Try again later.", "error");
    }
  };

  return (
    <div className="relative">
      <form
        onSubmit={handleCertify}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
      >
        <h2 className="text-2xl font-semibold text-emerald-800 mb-4">
          2. Log Processing & Certification
        </h2>

        {/* Batch ID */}
        <div className="mb-4">
          <label className="block mb-1">
            <QrCode size={16} className="inline mr-2" /> Batch ID
          </label>
          <input
            type="text"
            id="processBatchId"
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Certificate Upload */}
        <div className="mb-4">
          <label className="block mb-1">
            <Upload size={16} className="inline mr-2" /> Upload Certificate
          </label>
          <input
            type="file"
            id="certificate"
            accept=".pdf,.doc,.docx"
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Test Details */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">
            <FlaskConical size={16} className="inline mr-2" /> Test Details
          </label>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-sm">Moisture</label>
              <input
                type="text"
                id="moisture"
                placeholder="e.g. 12%"
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">Purity</label>
              <input
                type="text"
                id="purity"
                placeholder="e.g. 98%"
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">pH</label>
              <input
                type="text"
                id="ph"
                placeholder="e.g. 6.8"
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label className="block mb-1">
            <ClipboardList size={16} className="inline mr-2" /> Notes
          </label>
          <textarea
            id="note"
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter any remarks or additional notes..."
          ></textarea>
        </div>

        {/* QA Result */}
        <select
          id="qaResult"
          className="p-3 border border-gray-300 rounded-lg w-1/3"
          required
        >
          <option value="Pending">Select...</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <button
          type="submit"
          className="ml-4 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 cursor-pointer"
        >
          <CheckCheck size={18} className="inline mr-2" /> Submit
        </button>
      </form>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default LogProcessing;
