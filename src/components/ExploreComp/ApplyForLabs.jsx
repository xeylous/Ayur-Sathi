// components/LabApplication.js
"use client";

import { useState } from "react";

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files: uploadedFiles } = e.target;
    if (uploadedFiles && uploadedFiles[0]) {
      setFiles({ ...files, [name]: uploadedFiles[0] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("📩 Form Submitted:", form, files);
    // TODO: Send form + files via API (multipart/form-data)
  };

  const handleDownloadTemplate = () => {
    // Example: Download a PDF template (you can replace with your real template URL)
    const link = document.createElement("a");
    link.href = "/Lab-template.pdf"; // put your file in public folder
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
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Lab Details
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lab Name
              </label>
              <input
                type="text"
                name="labName"
                value={form.labName}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#90A955] focus:outline-none"
                placeholder="Enter lab name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lab Address
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#90A955] focus:outline-none"
                placeholder="Full lab address"
              />
            </div>
          </div>

          {/* Owner Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Owner Details
            </h3>

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
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#90A955] focus:outline-none"
                  placeholder="Owner full name"
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#90A955] focus:outline-none"
                  placeholder="owner@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PAN Card Number
              </label>
              <input
                type="text"
                name="panCard"
                value={form.panCard}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#90A955] focus:outline-none"
                placeholder="ABCDE1234F"
              />
            </div>
          </div>

          {/* Required Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Required Documentation
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Owner Government ID (PDF)
              </label>
              <input
                type="file"
                name="ownerIdProof"
                accept=".pdf"
                onChange={handleFileChange}
                required
                className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#90A955] file:text-white hover:file:bg-[#90A955]/80"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PAN Card (PDF)
              </label>
              <input
                type="file"
                name="panCardDoc"
                accept=".pdf"
                onChange={handleFileChange}
                required
                className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#90A955] file:text-white hover:file:bg-[#90A955]/80"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ownership / Registration Proof (PDF)
              </label>
              <input
                type="file"
                name="ownershipDocs"
                accept=".pdf"
                onChange={handleFileChange}
                required
                className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#90A955] file:text-white hover:file:bg-[#90A955]/80"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Signed Agreement (Upload PDF)
              </label>
              <input
                type="file"
                name="signedAgreement"
                accept=".pdf"
                onChange={handleFileChange}
                required
                className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#90A955] file:text-white hover:file:bg-[#90A955]/80"
              />
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="mt-2 text-sm text-[#90A955] underline hover:text-[#90A955]/80"
              >
                Download Agreement Template
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#90A955] text-white py-3 rounded-xl font-semibold hover:bg-[#90A955]/80 transition-all duration-200 shadow-md"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}
