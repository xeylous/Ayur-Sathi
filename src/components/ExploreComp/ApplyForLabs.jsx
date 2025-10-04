"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LabApplication() {
  const [form, setForm] = useState({
    labName: "",
    address: "",
    ownerName: "",
    ownerEmail: "",
    panCard: "",
  });

  const [files, setFiles] = useState({
    ownerIdProof: null,
    panCardDoc: null,
    ownershipDocs: null,
    signedAgreement: null,
  });

  const [errors, setErrors] = useState({
    ownerIdProof: "",
    panCardDoc: "",
    ownershipDocs: "",
    signedAgreement: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files: uploadedFiles } = e.target;

    if (uploadedFiles && uploadedFiles[0]) {
      const file = uploadedFiles[0];

      // ✅ Validate file type
      if (file.type !== "application/pdf") {
        setErrors((prev) => ({ ...prev, [name]: "Only PDF files are allowed." }));
        setFiles((prev) => ({ ...prev, [name]: null }));
        return;
      }

      // ✅ Validate file size (<=200KB)
      if (file.size > 200 * 1024) {
        console.error(`${name} file is larger than 200KB`);
        setErrors((prev) => ({
          ...prev,
          [name]: "File size must be below 200KB.",
        }));
        setFiles((prev) => ({ ...prev, [name]: null }));
        return;
      }

      // ✅ Valid file
      setFiles((prev) => ({ ...prev, [name]: file }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // block submission if errors exist
    if (Object.values(errors).some((err) => err !== "")) {
      toast.error("Please fix file errors before submitting.", { autoClose: 3000 });
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    Object.entries(files).forEach(([key, value]) => value && formData.append(key, value));

    try {
      const res = await fetch("/api/partnership", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Application submitted successfully!", { autoClose: 3000 });

        // ✅ Reset form fields & files after successful submission
        setForm({
          labName: "",
          address: "",
          ownerName: "",
          ownerEmail: "",
          panCard: "",
        });
        setFiles({
          ownerIdProof: null,
          panCardDoc: null,
          ownershipDocs: null,
          signedAgreement: null,
        });
        setErrors({
          ownerIdProof: "",
          panCardDoc: "",
          ownershipDocs: "",
          signedAgreement: "",
        });
        // reset actual file inputs
        document.querySelectorAll("input[type=file]").forEach((input) => (input.value = ""));
      } else {
        toast.error("Submission failed: " + (data.error || "Unknown error"), { autoClose: 3000 });
      }
      console.log("Server Response:", data);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Submission failed. Please try again.", { autoClose: 3000 });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = "/Lab-template.pdf";
    link.download = "Lab_Owner_Agreement_Template.pdf";
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#ECF39E]/30 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Laboratory Registration Application
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Lab Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Lab Details</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lab Name</label>
              <input
                type="text"
                name="labName"
                value={form.labName}
                onChange={handleChange}
                required
                placeholder="Enter lab name"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#90A955] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lab Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Full lab address"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#90A955] focus:outline-none"
              />
            </div>
          </div>

          {/* Owner Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Owner Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                <input
                  type="text"
                  name="ownerName"
                  value={form.ownerName}
                  onChange={handleChange}
                  required
                  placeholder="Owner full name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#90A955] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner Email</label>
                <input
                  type="email"
                  name="ownerEmail"
                  value={form.ownerEmail}
                  onChange={handleChange}
                  required
                  placeholder="owner@example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#90A955] focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PAN Card Number</label>
              <input
                type="text"
                name="panCard"
                value={form.panCard}
                onChange={handleChange}
                required
                placeholder="ABCDE1234F"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#90A955] focus:outline-none"
              />
            </div>
          </div>

          {/* Required Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Required Documentation</h3>
            {["ownerIdProof", "panCardDoc", "ownershipDocs", "signedAgreement"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field === "signedAgreement"
                    ? "Signed Agreement (Upload PDF)"
                    : field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="file"
                  name={field}
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                  className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#90A955] file:text-white hover:file:bg-[#90A955]/80"
                />
                <p className="text-xs text-gray-500 mt-1">Only PDF files up to 200KB are allowed.</p>
                {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}

                {field === "signedAgreement" && (
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="mt-2 text-sm text-[#90A955] underline hover:text-[#90A955]/80"
                  >
                    Download Agreement Template
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting || Object.values(errors).some((err) => err !== "")}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 shadow-md ${
              submitting || Object.values(errors).some((err) => err !== "")
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-[#90A955] hover:bg-[#90A955]/80 text-white"
            }`}
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>

      {/* Toastify container */}
      <ToastContainer />
    </div>
  );
}
