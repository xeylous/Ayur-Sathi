
"use client";

import { useState, useEffect } from "react";
import { User, ShoppingCart, History, Bell, Leaf } from "lucide-react";
import Profile from "./Profile";
import UserOrder from "./User_Order";
import AddToCart from "./AddToCart";

const menuItems = [
  { key: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
  { key: "orders", label: "My Orders", icon: <ShoppingCart className="w-5 h-5" /> },
 { key: "carts", label: "My Carts", icon: <ShoppingCart className="w-5 h-5" /> },
  { key: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" /> },
];

export default function UserDashboard() {
  const [active, setActive] = useState("profile");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab && ["profile", "orders", "carts", "notifications"].includes(tab)) {
        setActive(tab);
      } else {
        try {
          const savedCart = localStorage.getItem("userCart");
          if (savedCart && JSON.parse(savedCart).length > 0) {
            setActive("carts");
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

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
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8fae3]/50">
      {/* Sidebar */}
      <aside className="md:w-64 w-full border-r border-[#90A955]/20 shadow-lg flex flex-col bg-[#31572C]">
        {/* Brand header */}
        <div className="p-5 border-b border-[#4F772D]/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4F772D] flex items-center justify-center">
              <Leaf className="w-4 h-4 text-[#ECF39E]" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              User Dashboard
            </span>
          </div>
        </div>

        {/* Scrollable nav + content */}
        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col py-2">
            {menuItems.map((item) => {
              const isActive = active === item.key;
              return (
                <div key={item.key} className="relative">
                  {/* Button */}
                  <button
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        setActive(isActive ? "" : item.key);
                      } else {
                        setActive(item.key);
                      }
                    }}
                    className={`flex items-center gap-3 w-full px-5 py-3.5 text-left transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-[#4F772D] text-white font-semibold border-r-[3px] border-[#ECF39E]"
                        : "text-white/70 hover:bg-[#4F772D]/40 hover:text-white"
                    }`}
                  >
                    <span className={isActive ? "text-[#ECF39E]" : "text-white/50"}>{item.icon}</span>
                    <span className="flex-1 text-sm">{item.label}</span>
                  </button>

                  {/* Inline content → only for phone */}
                  <div className="md:hidden">
                    {isActive && <div className="bg-[#f8fae3]/50">{renderContent(item.key)}</div>}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-[#4F772D]/40">
          <p className="text-[10px] text-white/30 text-center uppercase tracking-wider">Ayurसाथी Platform</p>
        </div>
      </aside>

      {/* Desktop / Tablet Content */}
      <main className="hidden md:block flex-1 p-6 overflow-y-auto bg-[#f8fae3]/30">
        {renderContent(active)}
      </main>
    </div>
  );
}

