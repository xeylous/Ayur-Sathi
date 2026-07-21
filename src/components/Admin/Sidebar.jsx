"use client";
import { useState } from "react";
import { LayoutDashboard, Users, DollarSign, FlaskConical, LogOut, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { logout, user } = useAuth();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const allTabs = [
    { id: "dashboard", icon: LayoutDashboard, label: "Overview" },
    { id: "user", icon: Users, label: "Lab Approvals" },
    { id: "farmerPayment", icon: DollarSign, label: "Farmer Payments" },
    { id: "laboratory", icon: FlaskConical, label: "Marketplace Listing" },
    { id: "manufacturer", icon: FlaskConical, label: "Manufacturer Approvals" },
    { id: "manufacturingLogs", icon: FileText, label: "Manufacturing Logs" }
  ];

  const allowedTabs = user?.role === "store_admin" || user?.type === "store_admin"
    ? allTabs.filter(tab => tab.id === "laboratory" || tab.id === "manufacturingLogs")
    : allTabs;

  return (
    <>
      <aside className="w-64 bg-indigo-900 text-white p-6 shadow-2xl h-full fixed top-0 left-0 flex flex-col justify-between">
      <div>
        <div className="text-2xl font-bold mb-8 text-teal-300 flex items-center gap-2">
          <LayoutDashboard size={24} /> AyurSaathi Admin
        </div>
        <nav className="space-y-3">
          {allowedTabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                activeTab === id
                  ? "bg-indigo-700 font-semibold border-l-4 border-amber-300"
                  : "hover:bg-indigo-800"
              }`}
            >
              <Icon size={20} className="mr-3" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <button
        onClick={() => setShowConfirmLogout(true)}
        className="flex items-center w-full px-4 py-3 rounded-lg text-red-300 hover:bg-indigo-800 hover:text-red-200 transition-colors mt-auto"
      >
        <LogOut size={20} className="mr-3" />
        Logout
      </button>
    </aside>

    {showConfirmLogout && (
      <div className="fixed inset-0 bg-[#31572C]/20 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200">
        <div className="bg-white border border-[#90A955]/30 shadow-2xl w-full max-w-sm rounded-2xl p-6 relative animate-in zoom-in-95 duration-200 text-center">
          <h3 className="text-xl font-bold text-[#31572C] mb-2">Are you sure?</h3>
          <p className="text-sm text-[#31572C]/90 mb-6 font-semibold">You will be logged out of your admin session.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowConfirmLogout(false)}
              className="px-4 py-2 text-sm bg-white/80 hover:bg-white text-gray-800 border border-gray-200 rounded-xl transition font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                logout();
                setShowConfirmLogout(false);
              }}
              className="px-4 py-2 text-sm bg-[#4F772D] hover:bg-[#31572C] text-white rounded-xl transition font-semibold cursor-pointer"
            >
              Yes, Logout
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);
};

export default Sidebar;
