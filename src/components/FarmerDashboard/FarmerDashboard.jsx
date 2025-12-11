"use client";

import { useEffect, useState } from "react";
import { User, Upload, History, Bell } from "lucide-react";
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

    // console.log("FarmerDashboard mounting Pusher, uniqueId:", user.uniqueId);
    // console.log("Client Pusher key:", process.env.NEXT_PUBLIC_PUSHER_KEY);
    // console.log("Client Pusher cluster:", process.env.NEXT_PUBLIC_PUSHER_CLUSTER);

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      forceTLS: true,
    });

    // // connection diagnostics (optional but helpful during debugging)
    // pusher.connection.bind("state_change", (states) => {
    //   // console.log("Pusher state change:", states);
    // });
    // pusher.connection.bind("connected", () => {
    //   // console.log("Pusher connected, socket id:", pusher.connection.socket_id);
    // });
    // pusher.connection.bind("disconnected", () => {
    //   // console.warn("Pusher disconnected");
    // });
    // pusher.connection.bind("error", (err) => {
    //   // console.error("Pusher connection error:", err);
    // });

    const channelName = `farmer-${String(user.uniqueId)}`;
    // console.log("Subscribing to channel:", channelName);
    const channel = pusher.subscribe(channelName);

    channel.bind("pusher:subscription_succeeded", () => {
      // console.log(`Subscribed to ${channelName} successfully`);
    });

    channel.bind("pusher:subscription_error", (status) => {
      // console.error("Subscription error for", channelName, status);
    });

    // event name must match server side trigger (example: "crop-status")
    channel.bind("crop-status", (data) => {
      // console.log("Received crop-status event:", data);
      // normalize the payload with timestamp if not present
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
        // console.log("Pusher disconnected and unsubscribed:", channelName);
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
      // If the notification has an _id, delete it from DB
      // Real-time pusher notifications might not have _id until refreshed, 
      // but usually we care about persisting what's in DB.
      // If it's a fresh pusher event, it might not be in DB yet? 
      // Actually, the API saves it first then pushes. So it should be in DB. 
      // But the pusher payload might not have the _id unless we include it. 
      // In accepted-batch route, we didn't send the _id in pusher payload.
      // So we might need to rely on refreshing or just accept that fresh ones might lack _id?
      // Wait, if we want to delete, we need _id.
      // If `id` is missing (fresh pusher event), we can't delete from DB easily.
      
      if (id) {
        const res = await fetch(`/api/notifications?id=${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!data.success) {
            // Revert if failed (optional, but good UX)
             console.warn("Failed to delete notification from DB");
             // setNotifications(previousNotifications); 
        }
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
      // setNotifications(previousNotifications);
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
            {/* Now presentational: receives notifications and removal handler */}
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
    <div className="flex flex-col md:flex-row max-h-screen bg-[#ECF39E] overflow-auto hide-scrollbar">
      {/* Sidebar */}
      <aside className="md:w-64 w-full border-r shadow-md flex flex-col bg-[#90A955]">
        <div className="p-4 text-lg font-bold text-green-700">
          🌿 Farmer Dashboard
        </div>

        {/* Scrollable nav + content */}
        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col">
            {menuItems.map((item) => {
              const isActive = active === item.key;
              return (
                <div key={item.key} className="border-b relative">
                  {/* Button */}
                  <button
                    onClick={() => setActive(isActive ? "" : item.key)}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-left transition ${
                      isActive
                        ? "bg-[#90A955] text-white font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span className="flex-1">{item.label}</span>

                    {/* simple badge for notifications count */}
                    {item.key === "notifications" && notifications.length > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-red-600 text-white">
                        {notifications.length}
                      </span>
                    )}
                  </button>

                  {/* Inline content → only for phone */}
                  <div className="md:hidden">
                    {isActive && <div>{renderContent(item.key)}</div>}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Desktop / Tablet content */}
      <main className="hidden md:block flex-1 p-6">{renderContent(active)}</main>
    </div>
  );
}
