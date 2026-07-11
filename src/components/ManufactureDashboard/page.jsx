"use client";
import { useState } from "react";
import {
  Scan,
  FileText,
  BarChart3,
  Wallet,
  Clock,
  CheckCircle,
  Menu,
  X,
  Factory,
} from "lucide-react";
import BatchVerification from "./BatchVerification";
import LogProcessing from "./LogProcessing";
import Analytics from "./Analytics";
import PaymentWithdraw from "./PaymentWithdraw";
import Toast from "./Toast";
import PendingBatchManager from "./PendingBactches";
import ManufacturedBatches from "./Manufactured";

const menuItems = [
  { id: "pending", label: "Pending Batches", icon: Clock },
  { id: "batch", label: "Batch Verification", icon: Scan },
  { id: "log", label: "Log Processing & QR", icon: FileText },
  { id: "manufactured", label: "Manufactured", icon: CheckCircle },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "payment", label: "Payment", icon: Wallet },
];

export default function ManufactureDashboard() {
  const [activeTab, setActiveTab] = useState("pending");
  const [toast, setToast] = useState({ message: "", type: "" });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false); // Close mobile sidebar on selection
  };

  const renderContent = () => {
    switch (activeTab) {
      case "batch":
        return <BatchVerification showToast={showToast} />;
      case "log":
        return <LogProcessing showToast={showToast} />;
      case "pending":
        return <PendingBatchManager showToast={showToast} />;
      case "analytics":
        return <Analytics />;
      case "payment":
        return <PaymentWithdraw showToast={showToast} />;
      case "manufactured":
        return <ManufacturedBatches showToast={showToast} />;
      default:
        return null;
    }
  };

  const activeLabel = menuItems.find((m) => m.id === activeTab)?.label || "Dashboard";

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#ECF39E]">
      {/* ── Mobile Header Bar ── */}
      <div className="md:hidden flex items-center justify-between bg-[#31572C] text-white px-4 py-3">
        <div className="flex items-center gap-2">
          <Factory className="w-5 h-5 text-[#ECF39E]" />
          <span className="font-bold text-lg">ManuDash</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg hover:bg-[#4F772D] transition"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed md:sticky md:top-0 md:h-screen inset-y-0 left-0 z-50
          w-64 flex-shrink-0
          bg-[#31572C] text-white
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Brand */}
        <div className="p-5 border-b border-[#4F772D]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#4F772D] flex items-center justify-center">
              <Factory className="w-5 h-5 text-[#ECF39E]" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide">ManuDash</h1>
              <p className="text-xs text-[#ECF39E]/70">Manufacturing Portal</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#4F772D] text-white shadow-md"
                    : "text-white/80 hover:bg-[#4F772D]/60 hover:text-white"
                }`}
              >
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? "text-[#ECF39E]" : ""}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#4F772D] text-xs text-[#ECF39E]/50">
          Ayur Saathi · v1.0
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar with breadcrumb */}
        <div className="bg-white/60 backdrop-blur-sm border-b border-[#90A955]/20 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-[#31572C]">
                {activeLabel}
              </h2>
              <p className="text-sm text-[#4F772D]/60 hidden sm:block">
                Manufacturing Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 md:p-6 lg:p-8">
          {renderContent()}
        </div>
      </main>

      {/* Toast */}
      <Toast message={toast.message} type={toast.type} />
    </div>
  );
}
