
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
    <div className="max-h-screen flex items-start justify-center py-6 bg-[#ECF39E]/30">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-6 sm:p-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
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
                className="border p-4 rounded-lg shadow-sm bg-[#F4F9F1] hover:shadow-md transition"
              >
                <p className="font-semibold text-lg text-gray-800">
                  {order.cropName}
                </p>
                <p className="text-gray-600">Quantity: {order.quantity}</p>
                <p className="text-gray-600">Date: {order.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

