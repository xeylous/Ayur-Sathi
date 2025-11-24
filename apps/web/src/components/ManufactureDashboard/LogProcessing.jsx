"use client";
import { useState } from "react";
import { PlusCircle, Trash2, CheckCircle, Clock } from "lucide-react";

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
  const [steps, setSteps] = useState([]);
  const [selectedStep, setSelectedStep] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState(null);

  const isLocked = Boolean(qrData);

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
      <h3 className="text-2xl font-semibold mb-6 text-green-700">
        Manufacturing Timeline
      </h3>

      <div className="bg-white p-6 rounded-2xl shadow-xl">
        
        {/* Inputs */}
        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Batch ID"
            value={logBatchId}
            disabled={isLocked}
            onChange={(e) => setLogBatchId(e.target.value)}
            className="w-full p-3 border rounded-xl"
          />

          <input
            type="text"
            placeholder="Operator Name"
            value={operator}
            disabled={isLocked}
            onChange={(e) => setOperator(e.target.value)}
            className="w-full p-3 border rounded-xl"
          />
        </div>

        {/* Dropdown + Add */}
        <div className="flex gap-3 mb-6">
          <select
            value={selectedStep}
            disabled={isLocked}
            onChange={(e) => setSelectedStep(e.target.value)}
            className="flex-grow p-3 border rounded-xl bg-white"
          >
            <option value="">Select manufacturing step...</option>
            {PROCESS_OPTIONS.map((step, i) => (
              <option key={i} value={step}>{step}</option>
            ))}
          </select>

          <button
            onClick={addStep}
            disabled={isLocked}
            className="bg-green-600 text-white px-4 py-3 rounded-xl flex gap-2 items-center hover:bg-green-700"
          >
            <PlusCircle /> Add
          </button>
        </div>

        {/* Timeline */}
        {steps.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-3">Timeline:</h4>
            <div className="pl-6 border-l-4 border-green-500 space-y-4 relative">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="absolute -left-3 w-5 h-5 bg-green-600 rounded-full border-2 border-white"></div>
                  <div className="bg-gray-50 p-3 rounded-lg shadow-sm flex justify-between w-full">
                    <p className="font-medium">Step {i + 1}: {step}</p>
                    <button 
                      onClick={() => deleteStep(i)} 
                      disabled={isLocked}
                    >
                      <Trash2 size={18} className="text-red-500 hover:text-red-700" />
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
          className="w-full bg-blue-600 text-white p-4 rounded-xl flex gap-2 items-center justify-center"
        >
          <CheckCircle /> {loading ? "Saving..." : "Save & Generate QR"}
        </button>

        {/* QR Display + Download */}
        <div className="mt-6 border border-dashed p-6 rounded-xl bg-gray-50 text-center">
          {qrData ? (
            <>
              <img src={qrData.url} className="mx-auto w-40 h-40" alt="QR Code" />
              <p className="text-green-600 font-semibold mt-2">QR Ready</p>

              <button
                onClick={() => downloadFile(qrData.url, `${qrData.batchId}_QR.png`)}
                className="mt-3 text-blue-600 underline text-sm"
              >
                Download QR
              </button>
            </>
          ) : (
            <p className="text-gray-500 italic">Waiting for processing save…</p>
          )}
        </div>
      </div>
    </div>
  );
}
