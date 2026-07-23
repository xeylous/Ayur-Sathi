
"use client";

import { useEffect, useState } from "react";

export default function UserOrder() {
  const [orders, setOrders] = useState([]);

  // Load orders from localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem("userOrders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  return (
    <div className="min-h-screen w-full flex items-start justify-center py-6 px-2 sm:px-4 bg-transparent">
      <div className="w-full max-w-4xl bg-white/95 border border-[#90A955]/20 shadow-xl rounded-2xl p-6 sm:p-10">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-[#31572C]">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            📦 No orders yet. Your orders will appear here once you place them.
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <div
                key={index}
                className="border border-[#90A955]/20 p-4 rounded-xl shadow-sm bg-[#ECF39E]/10 hover:bg-[#ECF39E]/20 transition-all duration-200"
              >
                <p className="font-bold text-lg text-[#31572C]">
                  {order.cropName}
                </p>
                <p className="text-gray-600 text-sm mt-1">Quantity: {order.quantity}</p>
                <p className="text-gray-500 text-xs mt-0.5">Date: {order.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

