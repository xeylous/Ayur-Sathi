// components/PartnershipForm.js
"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PartnershipForm() {
  const [form, setForm] = useState({
    organizationName: "",
    contactPerson: "",
    email: "",
    phone: "",
    partnershipType: "",
    proposal: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("📩 Partnership Form Submitted:", form);

      // TODO: send data to backend API
      await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate API delay

      toast.success("Partnership request submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // reset form after submission
      setForm({
        organizationName: "",
        contactPerson: "",
        email: "",
        phone: "",
        partnershipType: "",
        proposal: "",
      });
    } catch (error) {
      toast.error("Failed to submit. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Partnership Application
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organization Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization / Company Name
            </label>
            <input
              type="text"
              name="organizationName"
              value={form.organizationName}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter your organization name"
            />
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person
            </label>
            <input
              type="text"
              name="contactPerson"
              value={form.contactPerson}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Full name of contact person"
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="contact@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          {/* Partnership Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Partnership Type
            </label>
            <select
              name="partnershipType"
              value={form.partnershipType}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">-- Select --</option>
              <option value="research">Research Collaboration</option>
              <option value="funding">Funding / Investment</option>
              <option value="technology">Technology Partnership</option>
              <option value="distribution">Distribution / Marketing</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Proposal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Partnership Proposal / Details
            </label>
            <textarea
              name="proposal"
              value={form.proposal}
              onChange={handleChange}
              rows={4}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Briefly describe your proposal or partnership interest"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 shadow-md 
              ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Partnership Request"}
          </button>
        </form>
      </div>

      {/* Toastify container */}
      <ToastContainer />
    </div>
  );
}
