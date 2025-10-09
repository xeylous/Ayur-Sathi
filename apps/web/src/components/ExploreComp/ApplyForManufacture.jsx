"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ApplyForManufacture() {
  const [form, setForm] = useState({
    manufacturerName: "",
    factoryAddress: "",
    ownerName: "",
    ownerEmail: "",
    gstNumber: "",
  });

  const [files, setFiles] = useState({
    gstRegistration: null,
    panCardCopy: null,
    factoryLicense: null,
    ownerIdProof: null,
    signedAgreement: null,
  });

  const [errors, setErrors] = useState({
    gstRegistration: "",
    panCardCopy: "",
    factoryLicense: "",
    ownerIdProof: "",
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
      const res = await fetch("/api/manufacture", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Application submitted successfully!", { autoClose: 3000 });

        // ✅ Reset form & files
        setForm({
          manufacturerName: "",
          factoryAddress: "",
          ownerName: "",
          ownerEmail: "",
          gstNumber: "",
        });
        setFiles({
          gstRegistration: null,
          panCardCopy: null,
          factoryLicense: null,
          ownerIdProof: null,
          signedAgreement: null,
        });
        setErrors({
          gstRegistration: "",
          panCardCopy: "",
          factoryLicense: "",
          ownerIdProof: "",
          signedAgreement: "",
        });

        // reset file inputs
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
    link.href = "/Manufacturer-Agreement-Template.pdf";
    link.download = "Manufacturer_Agreement_Template.pdf";
    link.click();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#ECF39E]/30">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Manufacturer Registration Application
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Manufacturer Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Manufacturer Details
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manufacturer Name
              </label>
              <input
                type="text"
                name="manufacturerName"
                value={form.manufacturerName}
                onChange={handleChange}
                required
                placeholder="Enter manufacturer name"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#90A955] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Factory Address
              </label>
              <textarea
                name="factoryAddress"
                value={form.factoryAddress}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Full factory address"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#90A955] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner Name
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner Email
                </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GST Number
              </label>
              <input
                type="text"
                name="gstNumber"
                value={form.gstNumber}
                onChange={handleChange}
                required
                placeholder="22AAAAA0000A1Z5"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#90A955] focus:outline-none"
              />
            </div>
          </div>

          {/* Required Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Required Documentation
            </h3>

            {[
              { name: "gstRegistration", label: "GST Registration Copy" },
              { name: "panCardCopy", label: "PAN Card Copy" },
              { name: "factoryLicense", label: "Factory License Copy" },
              { name: "ownerIdProof", label: "Owner ID Proof (Aadhaar / Voter ID)" },
              { name: "signedAgreement", label: "Signed Partnership Agreement" },
            ].map(({ name, label }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>

                <div className="flex items-center gap-3">
                  <label
                    htmlFor={name}
                    className="inline-block bg-[#90A955] text-white text-sm py-2 px-4 rounded-lg cursor-pointer hover:bg-[#90A955]/80 transition"
                  >
                    Choose PDF
                  </label>
                  <input
                    id={name}
                    type="file"
                    name={name}
                    accept=".pdf"
                    onChange={handleFileChange}
                    required
                    hidden
                  />
                  {files[name] && (
                    <span className="text-sm text-gray-600 truncate max-w-[200px]">
                      {files[name].name}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Only PDF files up to 200KB are allowed.
                </p>
                {errors[name] && (
                  <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
                )}

                {name === "signedAgreement" && (
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
                : "bg-[#90A955] hover:bg-[#90A955]/80 text-white cursor-pointer"
            }`}
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
}
