"use client";
import React, { useState, useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";

function TypingIndicator() {
  return (
    <div className="flex space-x-1 bg-[#E7F5CE] px-3 py-2 rounded-xl shadow-sm w-fit">
      <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></span>
      <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200"></span>
      <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-400"></span>
    </div>
  );
}

export default function ChatbotAssistant() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto send greeting message when opened
  useEffect(() => {
    if (open && messages.length === 0) {
      sendMessageToAPI("hi");
    }
  }, [open]);

  // Format newline responses
  const formatMessage = (text) =>
    text.split("\n").map((line, i) => <p key={i}>{line}</p>);

  const sendMessageToAPI = async (msg) => {
    setLoading(true);

    // Smart ending logic
    if (["thanks", "thank you", "thx"].includes(msg.toLowerCase())) {
      setMessages((prev) => [...prev, { sender: "user", text: msg }]);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "🙏 Thank you! Take care and stay healthy 💚",
          },
        ]);
      }, 700);

      setTimeout(() => {
        setOpen(false);
        setMessages([]);
      }, 2500);

      setLoading(false);
      return;
    }

    if (msg !== "hi") {
      setMessages((prev) => [...prev, { sender: "user", text: msg }]);
    }

    try {
      const res = await fetch("https://ayurgyani.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "test-user", message: msg }),
      });

      const data = await res.json();

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: data.reply || "⚠️ No reply received." },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Network error. Try again." },
      ]);
      setLoading(false);
    }
  };

  // Toggle / Reset chat when closed
  const handleToggle = () => {
    if (open) {
      setMessages([]);
      setMessage("");
    }
    setOpen(!open);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleToggle}
        className="fixed bottom-5 right-5 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-xl"
      >
        <MessageCircle size={28} />
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 w-80 bg-[#F4F9E9] rounded-2xl shadow-2xl p-4 border border-green-300 flex flex-col animate-fadeIn z-50">

          {/* HEADER */}
          <div className="text-center py-2 font-semibold text-green-700 text-lg border-b">
            🌿 Ayur Gyani
          </div>

          {/* CHAT WINDOW */}
          <div className="flex-1 overflow-y-auto space-y-3 p-2 max-h-72">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-tight shadow-sm ${
                  msg.sender === "bot"
                    ? "bg-white border border-green-200 text-gray-900 self-start rounded-bl-sm"
                    : "bg-green-600 text-white self-end ml-auto rounded-br-sm"
                }`}
              >
                {formatMessage(msg.text)}

                {/* Tip under bot reply */}
                {msg.sender === "bot" && (
                  <p className="text-[10px] text-gray-500 mt-1 italic">
                    💡 Tip: Type “Thanks” anytime to end the chat.
                  </p>
                )}
              </div>
            ))}

            {loading && <TypingIndicator />}

            <div ref={chatEndRef}></div>
          </div>

          {/* INPUT SECTION */}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && message.trim()) {
                  sendMessageToAPI(message);
                  setMessage("");
                }
              }}
              className="flex-1 px-3 py-2 rounded-full border outline-none text-sm shadow-sm"
            />

            <button
              onClick={() => {
                if (message.trim()) {
                  sendMessageToAPI(message);
                  setMessage("");
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-full text-sm"
            >
              Send
            </button>
          </div>

          {/* CLOSE BUTTON */}
          <button
            onClick={handleToggle}
            className="absolute top-2 right-4 text-gray-600 hover:text-red-500 text-lg font-bold"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
