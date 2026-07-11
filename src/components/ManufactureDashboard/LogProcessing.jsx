"use client";
import { useState, useRef } from "react";
import { PlusCircle, Trash2, CheckCircle, CalendarDays, Package } from "lucide-react";

const PROCESS_OPTIONS = [
  "Raw Material Receiving",
  "Sorting / Grading",
  "Cleaning",
  "Washing",
  "Sun Drying",
  "Shade Drying",
  "Oven Drying / Dehydration",
  "Cutting / Chopping",
  "Pulverizing / Grinding",
  "Sieving / Mesh Size Screening",
  "Granulation",
  "Boiling / Decoction",
  "Steam Distillation",
  "Alcohol Extraction",
  "Filtration",
  "Concentration",
  "Mixing / Blending",
  "Formulation",
  "Filling",
  "Sealing",
  "Labeling",
  "Packaging",
  "Final Quality Check",
];

export default function LogProcessing({ showToast }) {
  const [logBatchId, setLogBatchId] = useState("");
  const [operator, setOperator] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [unitWeight, setUnitWeight] = useState("");
  const [productKnowledge, setProductKnowledge] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [steps, setSteps] = useState([]);
  const [selectedStep, setSelectedStep] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState(null);

  const dateInputRef = useRef(null);
  const isLocked = Boolean(qrData);

  // Helper: format date for display
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper: get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // ✅ Helper function to download Cloudinary file
  const downloadFile = (url, filename) => {
    if (!url) return;

    const downloadUrl = url.includes("/upload/")
      ? url.replace("/upload/", "/upload/fl_attachment/")
      : url;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addStep = () => {
    if (!selectedStep) return showToast("Select a process step.", "error");

    if (steps.includes(selectedStep))
      return showToast("This step is already added.", "warning");

    setSteps([...steps, selectedStep]);
    setSelectedStep("");
  };

  const deleteStep = (index) => setSteps(steps.filter((_, i) => i !== index));

  const saveProcessing = async () => {
    if (!logBatchId || !operator)
      return showToast("Batch ID & Operator required.", "error");

    if (!productQuantity || Number(productQuantity) <= 0)
      return showToast("Enter a valid product quantity.", "error");

    if (!expiryDate)
      return showToast("Select a product expiry date.", "error");

    if (steps.length === 0)
      return showToast("Add at least one step before saving.", "error");

    setLoading(true);

    try {
      const res = await fetch("/api/manufacture/processing", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchId: logBatchId,
          operator,
          productQuantity: Number(productQuantity),
          productExpiryDate: expiryDate,
          unitWeight,
          productKnowledge,
          processes: steps.map((s) => ({ processName: s })),
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setLoading(false);
        return showToast(data.message, "error");
      }

      setQrData({
        url: data.qrUrl,
        batchId: logBatchId,
        steps,
      });

      showToast("Saved & QR Created!", "success");
    } catch (err) {
      console.error(err);
      showToast("Server error.", "error");
    }

    setLoading(false);
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6 text-[#31572C]">
        Manufacturing Timeline
      </h3>

      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
        
        {/* Inputs — 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Batch ID */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Batch ID</label>
            <input
              type="text"
              placeholder="e.g. ASW-2025-0042"
              value={logBatchId}
              disabled={isLocked}
              onChange={(e) => setLogBatchId(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#90A955] focus:border-[#90A955] outline-none transition-all disabled:opacity-50"
            />
          </div>

          {/* Operator Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Operator Name</label>
            <input
              type="text"
              placeholder="e.g. Rajesh Kumar"
              value={operator}
              disabled={isLocked}
              onChange={(e) => setOperator(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#90A955] focus:border-[#90A955] outline-none transition-all disabled:opacity-50"
            />
          </div>

          {/* Product Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Package className="w-4 h-4 text-[#4F772D]" />
                Product Quantity
              </span>
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="e.g. 500"
                value={productQuantity}
                min="1"
                disabled={isLocked}
                onChange={(e) => setProductQuantity(e.target.value)}
                className="w-full p-3 pr-16 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#90A955] focus:border-[#90A955] outline-none transition-all disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium pointer-events-none">
                units
              </span>
            </div>
          </div>

          {/* Unit Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Package className="w-4 h-4 text-[#4F772D]" />
                Unit Weight
              </span>
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="e.g. 500"
                min="0"
                value={unitWeight}
                disabled={isLocked}
                onChange={(e) => setUnitWeight(e.target.value)}
                className="w-full p-3 pr-12 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#90A955] focus:border-[#90A955] outline-none transition-all disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium pointer-events-none">
                gm
              </span>
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-[#4F772D]" />
                Product Expiry Date
              </span>
            </label>
            <div className="relative">
              <input
                ref={dateInputRef}
                type="date"
                value={expiryDate}
                min={getMinDate()}
                disabled={isLocked}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#90A955] focus:border-[#90A955] outline-none transition-all disabled:opacity-50 cursor-pointer"
              />
              {expiryDate && (
                <p className="mt-1 text-xs text-[#4F772D] font-medium">
                  Expires: {formatDisplayDate(expiryDate)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Product Knowledge */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1.5">
            Product Knowledge (Required Storage, Usage, etc.)
          </label>
          <textarea
            rows="3"
            placeholder="e.g. Store in a cool, dry place. Keep away from direct sunlight."
            value={productKnowledge}
            disabled={isLocked}
            onChange={(e) => setProductKnowledge(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#90A955] focus:border-[#90A955] outline-none transition-all disabled:opacity-50 resize-none"
          ></textarea>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-6" />

        {/* Dropdown + Add */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Manufacturing Steps</label>
          <div className="flex gap-3">
            <select
              value={selectedStep}
              disabled={isLocked}
              onChange={(e) => setSelectedStep(e.target.value)}
              className="flex-grow p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#90A955] focus:border-[#90A955] outline-none transition-all disabled:opacity-50"
            >
              <option value="">Select manufacturing step...</option>
              {PROCESS_OPTIONS.map((step, i) => (
                <option key={i} value={step}>{step}</option>
              ))}
            </select>

            <button
              onClick={addStep}
              disabled={isLocked}
              className="bg-[#4F772D] text-white px-4 py-3 rounded-xl flex gap-2 items-center hover:bg-[#31572C] transition-colors disabled:opacity-50 shrink-0"
            >
              <PlusCircle size={18} /> Add
            </button>
          </div>
        </div>

        {/* Timeline */}
        {steps.length > 0 && (
          <div className="mt-6 mb-6">
            <h4 className="font-semibold text-gray-700 mb-3">Timeline:</h4>
            <div className="pl-6 border-l-4 border-[#90A955] space-y-4 relative">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="absolute -left-3 w-5 h-5 bg-[#4F772D] rounded-full border-2 border-white shadow-sm"></div>
                  <div className="bg-gray-50 p-3 rounded-lg shadow-sm flex justify-between w-full border border-gray-100">
                    <p className="font-medium text-gray-700">Step {i + 1}: {step}</p>
                    <button 
                      onClick={() => deleteStep(i)} 
                      disabled={isLocked}
                      className="disabled:opacity-30"
                    >
                      <Trash2 size={18} className="text-red-400 hover:text-red-600 transition-colors" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save */}
        <button
          onClick={saveProcessing}
          disabled={loading || isLocked}
          className="w-full mt-6 bg-[#31572C] text-white p-4 rounded-xl flex gap-2 items-center justify-center font-semibold hover:bg-[#4F772D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          <CheckCircle size={20} /> {loading ? "Saving..." : "Save & Generate QR"}
        </button>

        {/* QR Display + Download */}
        <div className="mt-6 border border-dashed border-gray-300 p-6 rounded-xl bg-gray-50 text-center">
          {qrData ? (
            <>
              <img src={qrData.url} className="mx-auto w-40 h-40 rounded-lg" alt="QR Code" />
              <p className="text-[#31572C] font-semibold mt-2">QR Ready</p>

              <button
                onClick={() => downloadFile(qrData.url, `${qrData.batchId}_QR.png`)}
                className="mt-3 text-[#4F772D] underline text-sm hover:text-[#31572C] transition-colors"
              >
                Download QR
              </button>
            </>
          ) : (
            <p className="text-gray-400 italic">Waiting for processing save…</p>
          )}
        </div>
      </div>
    </div>
  );
}
