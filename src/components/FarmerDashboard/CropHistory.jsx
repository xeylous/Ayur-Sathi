
"use client";

import { useState } from "react";
import { Clock } from "lucide-react";

export default function CropHistory() {
  const [history] = useState([
    {
      id: 1,
      crop: "🌾 Wheat",
      quantity: "200kg",
      date: "20/09/2025",
      status: "Approved",
    },
    {
      id: 2,
      crop: "🌽 Corn",
      quantity: "150kg",
      date: "10/09/2025",
      status: "Pending",
    },
    {
      id: 3,
      crop: "🥔 Potato",
      quantity: "500kg",
      date: "05/09/2025",
      status: "Approved",
    },
  ]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6 md:mt-0">
      <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2 text-green-800">
        <Clock className="w-6 h-6" />
        Crop Upload History
      </h2>

      {history.length === 0 ? (
        <p className="text-gray-600 text-center">No history available.</p>
      ) : (
        <ul className="space-y-4">
          {history.map((item) => (
            <li
              key={item.id}
              className="p-4 border rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center bg-[#ECF39E]/30 hover:bg-[#90A955]/10 transition"
            >
              <div>
                <p className="font-semibold text-gray-800">{item.crop}</p>
                <p className="text-sm text-gray-600">
                  {item.quantity} • {item.date}
                </p>
              </div>
              <span
                className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium ${
                  item.status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {item.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
