"use client";
import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Loader2, Sparkles, CheckCircle2, ShieldAlert, Mail, BookOpen } from "lucide-react";
import Image from "next/image";
import CryptoJS from "crypto-js";

// Enterprise AyurGyani API Endpoint Configuration
const AYURGYANI_API_URL = process.env.NEXT_PUBLIC_AYURGYANI_URL || "https://ayurgyani-api.onrender.com";

export default function ChatbotAssistant() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [batchInput, setBatchInput] = useState("");
  const [userId, setUserId] = useState("");
  
  const chatEndRef = useRef(null);
  const chatActive = useRef(false);

  // Initialize or retrieve persistent user session ID
  useEffect(() => {
    let storedId = typeof window !== "undefined" ? localStorage.getItem("ayurgyani_user_id") : null;
    if (!storedId) {
      storedId = "user_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now();
      if (typeof window !== "undefined") {
        localStorage.setItem("ayurgyani_user_id", storedId);
      }
    }
    setUserId(storedId);
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Decrypt batch details
  const decrypt = (encryptedText) => {
    const secretKey = process.env.NEXT_PUBLIC_SECRET || "default_ayurvedic_secret_key_32";
    const key = CryptoJS.enc.Utf8.parse(secretKey.padEnd(32, "0"));
    const [ivBase64, encryptedBase64] = encryptedText.split(":");

    const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key, {
      iv: CryptoJS.enc.Base64.parse(ivBase64),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  };

  // Check Batch Status handler
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
      setMessages([{ sender: "bot", text: "⚠️ Could not fetch batch status." }]);
    }

    setLoading(false);
  };

  // Send message to AyurGyani Enterprise Agent
  const sendMessageToAPI = async (msg) => {
    if (!msg.trim()) return;
    if (!chatActive.current || mode !== "chat") return;

    setMessages((prev) => [...prev, { sender: "user", text: msg }]);
    setMessage("");
    setLoading(true);

    let active = true;

    try {
      const res = await fetch(`${AYURGYANI_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId || "guest_user", message: msg }),
      });

      const data = await res.json();

      if (!active || !chatActive.current || mode !== "chat") return;

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply || "Namaste 🌿 How else may I support you today?",
          toolsExecuted: data.toolsExecuted || [],
          modelUsed: data.modelUsed
        },
      ]);
    } catch (err) {
      if (!active || !chatActive.current || mode !== "chat") return;

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Network connection error. Please try again." },
      ]);
    }

    if (active && chatActive.current && mode === "chat") {
      setLoading(false);
    }

    return () => {
      active = false;
    };
  };

  // Toggle chat window open/close
  const handleToggle = () => {
    if (open) {
      chatActive.current = false;
      setMessages([]);
      setMode(null);
      setBatchInput("");
    }
    setOpen(!open);
  };

  // Initial Chat Onboarding trigger when user enters chat mode
  useEffect(() => {
    if (mode !== "chat") return;

    let active = true;
    chatActive.current = true;
    setLoading(true);

    fetch(`${AYURGYANI_API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userId || "guest_user", message: "" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!active || !chatActive.current) return;

        setMessages([
          {
            sender: "bot",
            text: data.reply || "Namaste 🙏 Welcome to AyurSathi! What is your good name?",
            toolsExecuted: data.toolsExecuted || [],
            modelUsed: data.modelUsed
          },
        ]);
      })
      .catch(() => {
        if (!active || !chatActive.current) return;

        setMessages([
          { sender: "bot", text: "⚠️ Unable to connect to AyurGyani engine. Please try again later." },
        ]);
      })
      .finally(() => {
        if (active && chatActive.current) setLoading(false);
      });

    return () => {
      active = false;
      chatActive.current = false;
    };
  }, [mode, userId]);

  // Render Tool Execution Badges
  const renderToolBadges = (tools) => {
    if (!tools || tools.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-2 border-t pt-1.5 border-gray-100">
        {tools.map((t, idx) => {
          let label = "Tool Executed";
          let icon = <Sparkles size={12} className="text-amber-500" />;

          if (t.toolName === "find_ayurvedic_remedy") {
            label = "Ayurvedic Remedy Found";
            icon = <CheckCircle2 size={12} className="text-green-600" />;
          } else if (t.toolName === "lookup_herb_details") {
            label = "Herb Details Lookup";
            icon = <BookOpen size={12} className="text-emerald-600" />;
          } else if (t.toolName === "check_safety_contraindications") {
            label = "Safety Checked";
            icon = <ShieldAlert size={12} className="text-orange-500" />;
          } else if (t.toolName === "send_recommendation_email") {
            label = "Email Digest Sent";
            icon = <Mail size={12} className="text-blue-500" />;
          }

          return (
            <span
              key={idx}
              className="inline-flex items-center gap-1 bg-green-50 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-medium border border-green-200"
            >
              {icon}
              {label}
            </span>
          );
        })}
      </div>
    );
  };

  function TypingDots() {
    return (
      <div className="flex items-center gap-1 bg-white border rounded-lg shadow-sm px-3 py-2 w-fit">
        <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce delay-150"></span>
        <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce delay-300"></span>
      </div>
    );
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={handleToggle}
        className="fixed bottom-5 right-5 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-xl z-[100000] transition-all transform hover:scale-105"
      >
        {open ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-5 w-80 sm:w-96 bg-[#ECECEC] rounded-2xl shadow-2xl border flex flex-col overflow-hidden z-[100000]">
          {/* Header */}
          <div className="bg-green-600 text-white flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              {mode !== null && (
                <button
                  onClick={() => {
                    chatActive.current = false;
                    setMessages([]);
                    setBatchInput("");
                    setMode(null);
                  }}
                  className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-white/20 transition"
                  title="Back"
                >
                  <span className="text-xl leading-none">←</span>
                </button>
              )}

              <Image
                src="/saint.jpg"
                width={38}
                height={38}
                alt="Ayur Gyani Logo"
                className="rounded-full border border-white/40 shadow-sm"
              />

              <div className="flex flex-col leading-tight">
                <span className="text-[16px] font-semibold flex items-center gap-1">
                  Ayur Gyani 🌿
                </span>
                <span className="text-[11px] text-white/80">
                  {mode === "chat" ? "Enterprise AI Assistant" : "Ayurvedic Intelligence Platform"}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-96 bg-[#F5F5F5]">
            {/* Mode Selection Options */}
            {mode === null && (
              <div className="space-y-3 py-4">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-xl w-full flex items-center justify-center gap-2 shadow-md transition"
                  onClick={() => {
                    chatActive.current = true;
                    setMessages([]);
                    setMode("chat");
                  }}
                >
                  💬 Talk to AyurSathi AI Assistant
                </button>

                <button
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-3 px-4 rounded-xl w-full flex items-center justify-center gap-2 shadow-md transition"
                  onClick={() => setMode("batch")}
                >
                  🔍 Check Herb Batch Traceability
                </button>
              </div>
            )}

            {/* Render Chat Messages */}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl max-w-[85%] text-sm ${
                  m.sender === "bot"
                    ? "bg-white border shadow-sm text-gray-800"
                    : "bg-green-600 text-white ml-auto shadow-sm"
                }`}
              >
                {/* Regular Bot / User Text */}
                {m.type !== "batch" && (
                  <div>
                    <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                    {m.sender === "bot" && renderToolBadges(m.toolsExecuted)}
                  </div>
                )}

                {/* Batch Status Card */}
                {m.type === "batch" && (
                  <>
                    <div className="text-xs leading-relaxed whitespace-pre-wrap font-mono bg-gray-50 p-2 rounded border border-gray-200">
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
                          }, 800);
                        }}
                        className="mt-3 w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-lg transition text-xs font-medium"
                      >
                        {loading ? "⏳ Opening..." : "📄 View Blockchain Certificate"}
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

          {/* Chat Mode Input Bar */}
          {mode === "chat" && (
            <div className="flex items-center gap-2 p-2 bg-white border-t">
              <input
                type="text"
                placeholder="Ask about herbs, remedies, health..."
                className="flex-1 px-4 py-2 rounded-full border border-gray-300 outline-none text-xs sm:text-sm focus:border-green-600 transition"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessageToAPI(message)}
              />
              <button
                onClick={() => sendMessageToAPI(message)}
                disabled={loading || !message.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition"
              >
                Send
              </button>
            </div>
          )}

          {/* Batch Status Input Form */}
          {mode === "batch" && (
            <div className="p-3 space-y-2 bg-white border-t">
              <input
                className="border px-3 py-2 w-full rounded-lg text-sm outline-none focus:border-green-600"
                placeholder="Enter Batch ID (e.g. ASW-2025-5031)"
                value={batchInput}
                onChange={(e) => setBatchInput(e.target.value)}
              />

              <button
                onClick={handleBatchCheck}
                disabled={loading || !batchInput.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2.5 rounded-lg w-full text-sm font-medium transition"
              >
                {loading ? "Checking..." : "Submit Batch Query"}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
