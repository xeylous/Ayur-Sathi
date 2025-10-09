"use client";
import { useState } from "react";
import { QrCode, Copy } from "lucide-react";

export default function LogProcessing({ showToast }) {
  const [logBatchId, setLogBatchId] = useState("");
  const [operator, setOperator] = useState("");
  const [notes, setNotes] = useState("");
  const [qrData, setQrData] = useState(null);

  const generateQr = () => {
    if (!logBatchId || !operator)
      return showToast("Batch ID and Operator Name are required.", "error");

    const qrObj = {
      id: logBatchId,
      op: operator,
      date: new Date().toISOString().slice(0, 10),
    };
    setQrData(qrObj);
    showToast(`QR Code generated for Batch ${logBatchId}.`, "success");
  };

  const copyQrData = () => {
    navigator.clipboard.writeText(JSON.stringify(qrData));
    showToast("QR data copied to clipboard!", "success");
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6 text-green-700">
        Log Processing & QR Generation
      </h3>
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl">
        <p className="mb-4 text-gray-600">
          Enter production log details to finalize the record and generate a
          scannable QR code for traceability.
        </p>

        <div className="space-y-4 mb-8">
          <input
            type="text"
            value={logBatchId}
            onChange={(e) => setLogBatchId(e.target.value)}
            placeholder="Batch ID (e.g., LOP-2023-45)"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500"
          />
          <input
            type="text"
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            placeholder="Operator Name"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500"
          />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Production Notes / Summary"
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <button
          onClick={generateQr}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center mb-6"
        >
          <QrCode className="w-5 h-5 mr-2" /> Finalize Log & Generate QR
        </button>

        <div className="border border-dashed border-gray-300 p-6 rounded-xl flex flex-col items-center justify-center min-h-[200px] bg-gray-50">
          {qrData ? (
            <div className="text-center">
              {/* Mock QR Display */}
              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-lg inline-block">
                <svg viewBox="0 0 100 100" className="w-32 h-32">
                  <rect width="100" height="100" fill="#FFF" />
                  <path
                    fill="#000"
                    d="M10 10h20v20H10z M70 10h20v20H70z M10 70h20v20H10z M45 45h10v10H45z M35 60h30v5H35z M60 35h5v30H60z M15 45h5v5H15z M80 20h5v5H80z M45 80h5v5H45z"
                  />
                </svg>
              </div>
              <p className="mt-4 text-xs text-gray-800 font-mono">
                <span className="font-bold">QR Data:</span> {qrData.id} -{" "}
                {qrData.op}
              </p>
              <button
                onClick={copyQrData}
                className="mt-3 text-xs text-blue-600 hover:text-blue-800 flex items-center justify-center mx-auto"
              >
                <Copy className="w-3 h-3 mr-1" /> Copy Raw Data
              </button>
            </div>
          ) : (
            <p className="text-gray-500 italic">
              QR code will appear here after generation.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
