"use client";

import { useState } from "react";
import { User, Upload, History, Bell } from "lucide-react";
import Profile from "./Profile";
import UploadCrop from "./Upload";
import CropHistory from "./CropHistory";

const menuItems = [
  { key: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
  { key: "upload", label: "Upload Crop", icon: <Upload className="w-5 h-5" /> },
  { key: "history", label: "Crop History", icon: <History className="w-5 h-5" /> },
  { key: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" /> },
];

export default function LabDashboard() {
  const [active, setActive] = useState("profile");

  const renderContent = (key) => {
    switch (key) {
      case "profile":
        return <Profile />;
      case "upload":
        return (
          <div>
            <UploadCrop/>
          </div>
        );
      case "history":
        return (
          <div>
           <CropHistory/>
          </div>
        );
      case "notifications":
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">Notifications</h2>
            <ul className="space-y-2 text-sm">
              <li className="p-2 border rounded-lg shadow-sm bg-yellow-50">
                📢 Your crop listing has been approved.
              </li>
              <li className="p-2 border rounded-lg shadow-sm bg-yellow-50">
                📢 New buyer request for Wheat.
              </li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row max-h-screen bg-[#ECF39E] overflow-auto hide-scrollbar">
      {/* Sidebar */}
      <aside className="md:w-64 w-full border-r shadow-md flex flex-col bg-[#90A955]">
        <div className="p-4 text-lg font-bold text-green-700">🌿 Farmer Dashboard</div>

        {/* Scrollable nav + content */}
        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col">
            {menuItems.map((item) => (
              <div key={item.key} className="border-b">
                {/* Button */}
                <button
                  onClick={() => setActive(active === item.key ? "" : item.key)}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-left transition ${
                    active === item.key
                      ? "bg-[#90A955] text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>

                {/* Inline content → only for phone */}
                <div className="md:hidden">
                  {active === item.key && <div>{renderContent(item.key)}</div>}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Desktop / Tablet content */}
      <main className="hidden md:block flex-1 p-6">{renderContent(active)}</main>
    </div>
  );
}
