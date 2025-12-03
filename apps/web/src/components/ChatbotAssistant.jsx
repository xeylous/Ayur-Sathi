"use client";
import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Loader2 } from "lucide-react";
import Image from "next/image";
import CryptoJS from "crypto-js";

export default function ChatbotAssistant() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [batchInput, setBatchInput] = useState("");
  const chatEndRef = useRef(null);
  const chatActive = useRef(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const decrypt = (encryptedText) => {
    const key = CryptoJS.enc.Utf8.parse(
      process.env.NEXT_PUBLIC_SECRET.padEnd(32, "0")
    );
    const [ivBase64, encryptedBase64] = encryptedText.split(":");

    const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key, {
      iv: CryptoJS.enc.Base64.parse(ivBase64),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  };

  const handleBatchCheck = async () => {
    if (!/^ASW-\d{4}-\d{4}$/i.test(batchInput)) {
      alert("❌ Invalid Batch ID Format. Use: ASW-2025-5031");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/public/batchStatus/${batchInput}`);
      const data = await res.json();
      const decrypted = decrypt(data.encrypted);

      setMessages([
        {
          sender: "bot",
          type: "batch",
          batch: decrypted,
        },
      ]);
    } catch {
      setMessages([{ sender: "bot", text: "⚠️ Could not fetch status." }]);
    }

    setLoading(false);
  };

const sendMessageToAPI = async (msg) => {
  if (!msg.trim()) return;

  if (!chatActive.current || mode !== "chat") return; // prevent ghost messages

  setMessages((prev) => [...prev, { sender: "user", text: msg }]);
  setMessage("");
  setLoading(true);

  let active = true;

  try {
    const res = await fetch("https://ayurgyani.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "test-user", message: msg }),
    });

    const data = await res.json();

    if (!active || !chatActive.current || mode !== "chat") return; // 🛑 BLOCK UPDATE

    setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
  } catch {
    if (!active || !chatActive.current || mode !== "chat") return; // 🛑 BLOCK UPDATE

    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "⚠️ Network error." },
    ]);
  }

  if (active && chatActive.current && mode === "chat") {
    setLoading(false);
  }

  return () => {
    active = false;
  };
};

  const handleToggle = () => {
    if (open) {
      setMessages([]);
      setMode(null);
      setBatchInput("");
    }
    setOpen(!open);
  };
  useEffect(() => {
  if (mode !== "chat") return;

  let active = true;
  chatActive.current = true;
  setLoading(true);

  fetch("https://ayurgyani.onrender.com/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: "test-user", message: "hi" }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!active) return; // ⛔ Prevent updating if user left
      if (!chatActive.current) return;

      setMessages([
        {
          sender: "bot",
          text: data.reply || "Hello! How can I assist you today?",
        },
      ]);
    })
    .catch(() => {
      if (!active) return;
      if (!chatActive.current) return;

      setMessages([
        { sender: "bot", text: "⚠️ Unable to connect. Try again later." },
      ]);
    })
    .finally(() => {
      if (active && chatActive.current) setLoading(false);
    });

  return () => {
    active = false;        // ⛔ Stop updates
    chatActive.current = false;
  };
}, [mode]);


  function TypingDots() {
    return (
      <div className="flex items-center gap-1 bg-white border rounded-lg shadow-sm px-3 py-2 w-fit">
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
      </div>
    );
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleToggle}
        className="fixed bottom-5 right-5 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-xl"
      >
        {open ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-5 w-80 bg-[#ECECEC] rounded-2xl shadow-2xl border flex flex-col overflow-hidden">
          {/* Header */}
          {/* <div className="bg-green-600 text-white flex items-center justify-between p-3">
            {mode !== null ? (
              <button
                className="text-white text-sm flex items-center gap-1 px-2 py-1 rounded hover:bg-white/20 transition"
                onClick={() => {
                  setMessages([]);
                  setBatchInput("");
                  setMode(null);
                }}
              >
                <span className="text-lg leading-none">←</span>
                Back
              </button>
            ) : (
              <div className="w-14"></div> // balanced spacing
            )}

            <div className="flex items-center gap-2">
              <Image
                src="/saint.jpg"
                width={40}
                height={40}
                alt="logo"
                className="rounded-full"
              />
              <h1 className="font-semibold text-lg">Ayur Gyani</h1>
            </div>

            <div className="w-14"></div>
          </div> */}

          <div className="bg-green-600 text-white flex items-center gap-3 px-3 py-2">
            {/* Back Button */}
            {mode !== null && (
              <button
                onClick={() => {
                  chatActive.current = false;
                  setMessages([]);
                  setBatchInput("");
                  setMode(null);
                }}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/20 transition"
              >
                <span className="text-xl leading-none">←</span>
              </button>
            )}

            {/* Profile Image */}
            <Image
              src="/saint.jpg"
              width={38}
              height={38}
              alt="logo"
              className="rounded-full border border-white/40"
            />

            {/* Name + Status */}
            <div className="flex flex-col leading-tight">
              <span className="text-[16px] font-semibold">Ayur Gyani</span>
              {/* <span className="text-[12px] text-white/80">
      {mode === "chat" ? "Online" : "How can I help you?"}
    </span> */}
            </div>
          </div>

          {/* Main Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-80 bg-[#F5F5F5]">
            {mode === null && (
              <div className="space-y-3">
                <button
                  className="bg-green-600 text-white py-2 rounded-lg w-full"
                  onClick={() => {
                    chatActive.current = true;
                    setMessages([]);
                    setMode("chat");
                  }}
                >
                  💬 Talk to Assistant
                </button>
                <button
                  className="bg-green-500 text-white py-2 rounded-lg w-full"
                  onClick={() => setMode("batch")}
                >
                  🔍 Check Batch Status
                </button>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[75%] ${
                  m.sender === "bot"
                    ? "bg-white border shadow-sm"
                    : "bg-green-600 text-white ml-auto"
                }`}
              >
                {/* Regular bot text */}
                {m.type !== "batch" && <p>{m.text}</p>}

                {/* Batch Card */}
                {m.type === "batch" && (
                  <>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                      {`📦 Batch Status

🆔 ${m.batch.batchId}
🌱 Species: ${m.batch.speciesId}
🟢 Status: ${m.batch.status}
🕒 ${m.batch.lastUpdated}
`}
                    </div>

                    {m.batch.certificateUrl && (
                      <button
                        onClick={() => {
                          setLoading(true);
                          setTimeout(() => {
                            window.open(m.batch.certificateUrl, "_blank");
                            setLoading(false);
                          }, 1000);
                        }}
                        className="mt-3 w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-lg transition text-sm"
                      >
                        {loading ? "⏳ Opening..." : "📄 View Certificate"}
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}

            {loading && mode === "chat" && (
              <div className="flex">
                <TypingDots />
              </div>
            )}

            <div ref={chatEndRef}></div>
          </div>

          {/* WhatsApp Style Input */}
          {mode === "chat" && (
            <div className="flex items-center gap-2 p-2 bg-white border-t">
              <input
                type="text"
                placeholder="Type message..."
                className="flex-1 px-3 py-2 rounded-full border outline-none text-sm"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && sendMessageToAPI(message)
                }
              />
              <button
                onClick={() => sendMessageToAPI(message)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full"
              >
                Send
              </button>
            </div>
          )}

          {/* Batch Input */}
          {mode === "batch" && (
            <div className="p-3 space-y-2">
              <input
                className="border px-3 py-2 w-full rounded-md"
                placeholder="ASW-2025-5031"
                value={batchInput}
                onChange={(e) => setBatchInput(e.target.value)}
              />

              <button
                onClick={handleBatchCheck}
                className="bg-green-600 text-white py-2 rounded-lg w-full"
              >
                {loading ? "Checking..." : "Submit"}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
