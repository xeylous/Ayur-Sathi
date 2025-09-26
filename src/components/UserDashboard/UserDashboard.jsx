"use client";

import { useState } from "react";
import { User, Upload, History, Bell } from "lucide-react";

const menuItems = [
  { key: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
  { key: "upload", label: "Upload Crop", icon: <Upload className="w-5 h-5" /> },
  { key: "history", label: "Crop History", icon: <History className="w-5 h-5" /> },
  { key: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" /> },
];

export default function UserDashboard() {
  const [active, setActive] = useState("profile");

  const renderContent = () => {
    switch (active) {
      case "profile":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
            <p className="text-gray-700">This is where farmer profile details will appear.</p>
          </div>
        );
      case "upload":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Upload Crop</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Crop Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-lg border border-gray-300 p-2 focus:ring focus:ring-green-300"
                  placeholder="Enter crop name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity (kg)</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-lg border border-gray-300 p-2 focus:ring focus:ring-green-300"
                  placeholder="Enter quantity"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                <input type="file" className="mt-1 block w-full text-sm text-gray-600" />
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Upload
              </button>
            </form>
          </div>
        );
      case "history":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Uploaded Crops History</h2>
            <ul className="space-y-2">
              <li className="p-3 border rounded-lg shadow-sm">🌾 Wheat - 200kg - Uploaded on 20/09/2025</li>
              <li className="p-3 border rounded-lg shadow-sm">🌽 Corn - 150kg - Uploaded on 10/09/2025</li>
            </ul>
          </div>
        );
      case "notifications":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
            <ul className="space-y-2">
              <li className="p-3 border rounded-lg shadow-sm bg-yellow-50">📢 Your crop listing has been approved.</li>
              <li className="p-3 border rounded-lg shadow-sm bg-yellow-50">📢 New buyer request for Wheat.</li>
            </ul>
          </div>
        );
      default:
        return <p>Select an option from the sidebar.</p>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-md">
        <div className="p-6 text-xl font-bold text-green-700">🌿 Farmer Panel</div>
        <nav className="flex flex-col">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`flex items-center gap-3 px-6 py-3 text-left transition ${
                active === item.key
                  ? "bg-green-100 text-green-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-8">{renderContent()}</main>
    </div>
  );
}
