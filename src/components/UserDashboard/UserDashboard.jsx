
"use client";

import { useState } from "react";
import { User, ShoppingCart, History, Bell } from "lucide-react";
import Profile from "./Profile";
import UserOrder from "./User_order";
import AddToCart from "./AddToCart";

const menuItems = [
  { key: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
  { key: "orders", label: "My Orders", icon: <ShoppingCart className="w-5 h-5" /> },
 { key: "carts", label: "My Carts", icon: <ShoppingCart className="w-5 h-5" /> },
  { key: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" /> },
];

export default function UserDashboard() {
  const [active, setActive] = useState("profile");

  const renderContent = (key) => {
    switch (key) {
      case "profile":
        return <Profile />;
      case "orders":
        return <UserOrder />;
      case "carts":
        return (
          <div className="p-4">
          <AddToCart  />
          </div>
        );
      case "notifications":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
            <ul className="space-y-2">
              <li className="p-3 border rounded-lg shadow-sm bg-yellow-50">
                📢 Your crop listing has been approved.
              </li>
              <li className="p-3 border rounded-lg shadow-sm bg-yellow-50">
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
      <aside className="md:w-64 w-full border-r shadow-md flex flex-col bg-[#ECF39E]/30">
        <div className="p-4 text-lg font-bold text-green-700">🌿 User Dashboard</div>

        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col">
            {menuItems.map((item) => (
              <div key={item.key} className="border-b">
                {/* Sidebar Button */}
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

                {/* Inline Content (for mobile only) */}
                <div className="md:hidden">
                  {active === item.key && <div>{renderContent(item.key)}</div>}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Desktop / Tablet Content */}
      <main className="hidden md:block flex-1 p-6">{renderContent(active)}</main>
    </div>
  );
}

