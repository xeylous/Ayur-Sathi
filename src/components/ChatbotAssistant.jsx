"use client";
import React, { useState } from "react";
import { MessageCircle } from "lucide-react"; // chatbot icon

export default function ChatbotAssistant() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Chatbot Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition flex items-center justify-center"
        aria-label="Chatbot assistant"
      >
        <MessageCircle size={28} />
      </button>

      {/* Popup Window */}
      {open && (
        <div className="fixed bottom-20 right-5 w-72 sm:w-80 bg-[#ECF39E] rounded-2xl shadow-2xl border border-gray-200 p-5 z-50">
          <h2 className="text-lg font-semibold text-green-700 mb-2">🤖 Ayur Saathi</h2>
          <p className="text-sm text-gray-700">
            Assistance <span className="font-semibold">coming soon...</span>
          </p>

          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            aria-label="Close chatbot"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
