"use client";

import { useEffect, useState } from "react";
import { User, Upload, History, Bell, Leaf } from "lucide-react";
import Profile from "./Profile";
import UploadCrop from "./Upload";
import CropHistory from "./CropHistory";
import { useAuth } from "@/context/AuthContext";
import FarmerNotifications from "./FarmerNotifications";
import Pusher from "pusher-js";

const menuItems = [
  { key: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
  { key: "upload", label: "Upload Crop", icon: <Upload className="w-5 h-5" /> },
  { key: "history", label: "Crop History", icon: <History className="w-5 h-5" /> },
  { key: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" /> },
];

export default function FarmerDashboard() {
  const [active, setActive] = useState("profile");
  const { user } = useAuth();

  // Notifications state lifted here
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  // Load notifications on mount or when user changes
  useEffect(() => {
    if (user?.uniqueId) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [user?.uniqueId]);

  // Pusher listener moved here so it's mounted regardless of visible tab
  useEffect(() => {
    if (!user?.uniqueId) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      forceTLS: true,
    });

    const channelName = `farmer-${String(user.uniqueId)}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("pusher:subscription_succeeded", () => {});

    channel.bind("pusher:subscription_error", (status) => {});

    // event name must match server side trigger (example: "crop-status")
    channel.bind("crop-status", (data) => {
      const event = {
        timestamp: data.timestamp || new Date().toISOString(),
        type: data.type || "notification",
        message: data.message || JSON.stringify(data),
        ...data,
      };
      setNotifications((prev) => [event, ...prev]);
    });

    // cleanup
    return () => {
      try {
        channel.unbind_all();
        pusher.unsubscribe(channelName);
        pusher.disconnect();
      } catch (e) {
        console.warn("Error during pusher cleanup:", e);
      }
    };
  }, [user?.uniqueId]);

  const handleRemoveNotification = async (id, index) => {
    // Optimistic update
    const previousNotifications = [...notifications];
    setNotifications((prev) => prev.filter((_, i) => i !== index));

    try {
      if (id) {
        const res = await fetch(`/api/notifications?id=${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!data.success) {
             console.warn("Failed to delete notification from DB");
        }
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const renderContent = (key) => {
    switch (key) {
      case "profile":
        return <Profile />;
      case "upload":
        return <UploadCrop />;
      case "history":
        return <CropHistory />;
      case "notifications":
        return (
          <div>
            <FarmerNotifications
              notifications={notifications}
              onRemove={handleRemoveNotification}
            />
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
              Farmer Dashboard
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

                    {/* Notification badge */}
                    {item.key === "notifications" && notifications.length > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#ECF39E] text-[#31572C]">
                        {notifications.length}
                      </span>
                    )}
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

      {/* Desktop / Tablet content */}
      <main className="hidden md:block flex-1 p-6 overflow-y-auto bg-[#f8fae3]/30">{renderContent(active)}</main>
    </div>
  );
}
