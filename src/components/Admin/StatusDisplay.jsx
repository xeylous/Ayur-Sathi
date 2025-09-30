"use client";
import { CheckCircle, XCircle } from "lucide-react";

const StatusDisplay = ({ statusMessage }) => {
  if (!statusMessage) return null;
  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-xl font-semibold shadow-2xl transition-opacity duration-300 z-50 ${
        statusMessage.isSuccess
          ? "bg-green-100 text-green-800 border border-green-400"
          : "bg-red-100 text-red-800 border border-red-400"
      }`}
    >
      {statusMessage.isSuccess ? (
        <CheckCircle size={16} className="inline mr-2" />
      ) : (
        <XCircle size={16} className="inline mr-2" />
      )}
      {statusMessage.message}
    </div>
  );
};

export default StatusDisplay;
