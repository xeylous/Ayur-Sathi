"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import BatchVerification from "./BatchVerification";
import LogProcessing from "./LogProcessing";
import Analytics from "./Analytics";
import PaymentWithdraw from "./PaymentWithdraw";

import Toast from "./Toast";

import "./styles.css";
import PendingBatchManager from "./PendingBactches";

export default function ManufactureDashboard() {
  const [activeTab, setActiveTab] = useState("batch");
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  return (
    <div className="bg-gray-50 h-screen overflow-hidden flex">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-grow p-6 md:p-10 overflow-y-auto">
        <header className="mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 border-b-4 border-green-500 pb-2 inline-block">
            Manufacturing Dashboard
          </h2>
        </header>

        {/* Tab Switching */}
        {activeTab === "batch" && <BatchVerification showToast={showToast} />}
        {activeTab === "log" && <LogProcessing showToast={showToast} />}
        {activeTab === "pending" && <PendingBatchManager showToast={showToast}/>}
        {activeTab === "analytics" && <Analytics />}
        {activeTab === "payment" && <PaymentWithdraw showToast={showToast} />}
        
        {/* Toast Message */}
        <Toast message={toast.message} type={toast.type} />
      </div>
    </div>
  );
}
