"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, X, Sparkles, CheckCircle2, ShieldAlert, Mail, BookOpen, RefreshCw, Send, LogOut, Clock } from "lucide-react";
import Image from "next/image";
import CryptoJS from "crypto-js";

import { motion, AnimatePresence } from "framer-motion";

// Enterprise AyurGyani API Endpoint Configuration
const AYURGYANI_API_URL = process.env.NEXT_PUBLIC_AYURGYANI_URL || "https://ayurgyani-api.onrender.com";

const INACTIVITY_DELAY = 120000; // 2 minutes (120,000 ms) of user inactivity

export default function ChatbotAssistant() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState("");
  const [sessionState, setSessionState] = useState("active"); // "active" | "ended"
  const [showInactivityPopup, setShowInactivityPopup] = useState(false);

  const chatEndRef = useRef(null);
  const chatActive = useRef(false);
  const inactivityTimerRef = useRef(null);

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

  // Decrypt batch details if needed
  const decrypt = (encryptedText) => {
    try {
      const secretKey = process.env.NEXT_PUBLIC_SECRET || "default_ayurvedic_secret_key_32";
      const key = CryptoJS.enc.Utf8.parse(secretKey.padEnd(32, "0"));
      const [ivBase64, encryptedBase64] = encryptedText.split(":");

      const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key, {
        iv: CryptoJS.enc.Base64.parse(ivBase64),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    } catch {
      return null;
    }
  };

  // Inactivity Timer Management (2 minutes idle trigger)
  const clearInactivityTimers = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }, []);

  const resetInactivityTimer = useCallback(() => {
    clearInactivityTimers();

    if (!open || sessionState === "ended") return;

    inactivityTimerRef.current = setTimeout(() => {
      setShowInactivityPopup(true);
    }, INACTIVITY_DELAY);
  }, [open, sessionState, clearInactivityTimers]);

  const handleEndChat = useCallback(() => {
    setShowInactivityPopup(false);
    clearInactivityTimers();
    setSessionState("ended");
    chatActive.current = false;
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: "Session closed. 🙏 Click below to start a new conversation whenever you need assistance!",
        isEndedNotice: true,
      },
    ]);
  }, [clearInactivityTimers]);

  const DEFAULT_GREETING = 
    "Namaste 🙏 Welcome to AyurSathi!\n\nHow can I assist your wellness journey today? You can:\n• Enter a Batch ID (e.g., ASW-2025-5031) to trace your herb's harvest, lab reports & blockchain provenance.\n• Ask any question about Ayurvedic herbs, natural remedies, or safety guidelines.";

  // Initial Onboarding Greeting
  const startNewConversation = useCallback(async (currentUserId) => {
    setShowInactivityPopup(false);
    clearInactivityTimers();
    setSessionState("active");
    chatActive.current = true;
    setLoading(true);
    setMessages([]);

    try {
      setMessages([
        {
          sender: "bot",
          text: DEFAULT_GREETING,
        },
      ]);
    } finally {
      if (chatActive.current) {
        setLoading(false);
        resetInactivityTimer();
      }
    }
  }, [clearInactivityTimers, resetInactivityTimer]);

  // Trigger when Chat Window opens/closes
  useEffect(() => {
    if (open) {
      if (messages.length === 0 && sessionState !== "ended") {
        startNewConversation(userId);
      } else if (sessionState !== "ended") {
        resetInactivityTimer();
      }
    } else {
      clearInactivityTimers();
    }
    return () => clearInactivityTimers();
  }, [open, userId, startNewConversation, resetInactivityTimer, clearInactivityTimers, messages.length, sessionState]);

  // Send message handler (Direct chat, Batch ID lookup, or Batch query intent)
  const sendMessageToAPI = async (msgText) => {
    const textToSend = msgText || message;
    if (!textToSend.trim()) return;
    if (sessionState === "ended") return;

    // Reset user activity timer
    setShowInactivityPopup(false);
    clearInactivityTimers();
    setSessionState("active");

    const userMsg = textToSend.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setMessage("");
    setLoading(true);

    // Direct Batch ID Check Handler if input contains ASW format (e.g. ASW-2025-5031)
    const batchIdMatch = userMsg.match(/ASW-\d{4}-\d{4}/i);

    if (batchIdMatch) {
      const targetBatchId = batchIdMatch[0].toUpperCase();
      try {
        const res = await fetch(`/api/public/batchStatus/${targetBatchId}`);
        const data = await res.json();
        const decrypted = decrypt(data.encrypted);

        if (decrypted) {
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              type: "batch",
              batch: decrypted,
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: `📦 Batch ${targetBatchId} status record retrieved, but encrypted payload could not be decoded.` },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: `⚠️ Could not retrieve batch status for ${targetBatchId}. Please verify the Batch ID.` },
        ]);
      } finally {
        setLoading(false);
        resetInactivityTimer();
      }
      return;
    }

    // Send all user messages directly to AyurGyani API Endpoint
    try {
      const res = await fetch(`${AYURGYANI_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId || "guest_user", message: userMsg }),
      });

      const data = await res.json();

      if (!chatActive.current) return;

      const replyText = data.reply || "Namaste 🌿 How else may I assist your Ayurvedic wellness journey today?";

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: replyText,
          toolsExecuted: data.toolsExecuted || [],
          modelUsed: data.modelUsed
        },
      ]);
    } catch {
      if (!chatActive.current) return;

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Network connection error. Please check your connection and try again." },
      ]);
    } finally {
      if (chatActive.current) {
        setLoading(false);
        resetInactivityTimer();
      }
    }
  };

  const handleToggle = () => {
    if (open) {
      clearInactivityTimers();
    }
    setOpen(!open);
  };

  const handleRestartChat = () => {
    startNewConversation(userId);
  };

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
            icon = <CheckCircle2 size={12} className="text-[#90A955]" />;
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
              className="inline-flex items-center gap-1 bg-[#ECF39E]/40 text-[#31572C] text-[10px] px-2 py-0.5 rounded-full font-medium border border-[#90A955]/30"
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
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl shadow-sm px-3.5 py-2.5 w-fit">
        <span className="w-2 h-2 bg-[#90A955] rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-[#90A955] rounded-full animate-bounce delay-150"></span>
        <span className="w-2 h-2 bg-[#90A955] rounded-full animate-bounce delay-300"></span>
      </div>
    );
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={handleToggle}
        className="fixed bottom-5 right-5 bg-[#31572C] hover:bg-[#4F772D] text-white p-4 rounded-full shadow-2xl z-[100000] transition-all transform hover:scale-105 border border-[#90A955]/30"
        aria-label="Open Chat Assistant"
      >
        {open ? <X size={26} /> : <MessageCircle size={26} />}
      </button>

      {/* Professional Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-5 w-85 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-[100000] h-[520px]">
          {/* Header */}
          <div className="bg-[#31572C] text-white flex items-center justify-between px-5 py-3.5 shadow-md relative overflow-hidden">
            {/* Top subtle gradient highlight line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ECF39E] via-[#90A955] to-transparent" />

            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src="/saint.jpg"
                  width={38}
                  height={38}
                  alt="AyurGyani Assistant"
                  className="rounded-full border-2 border-[#90A955] object-cover shadow-sm"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#ECF39E] rounded-full ring-2 ring-[#31572C]" />
              </div>

              <div className="flex flex-col leading-tight">
                <span className="text-base font-bold flex items-center gap-1.5 text-white">
                  AyurGyani 🌿
                </span>
                <span className="text-[11px] text-[#ECF39E]/90 font-medium">
                  {sessionState === "ended" ? "Session Closed" : "Online • AyurSathi Assistant"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {sessionState !== "ended" && (
                <button
                  onClick={handleEndChat}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-[#ECF39E] hover:text-white text-xs font-semibold transition cursor-pointer border border-[#90A955]/30 shadow-xs"
                  title="End current conversation"
                >
                  <LogOut size={13} />
                  <span>End</span>
                </button>
              )}

              <button
                onClick={handleToggle}
                className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer"
                title="Close window"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Main Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F9FAF6]">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-2xl max-w-[85%] text-xs sm:text-sm leading-relaxed ${
                  m.sender === "bot"
                    ? m.isWarning
                      ? "bg-amber-50 border border-amber-200 text-amber-900 shadow-sm"
                      : m.isEndedNotice
                      ? "bg-gray-100 border border-gray-200 text-gray-700 shadow-sm"
                      : "bg-white border border-[#90A955]/20 shadow-sm text-gray-800"
                    : "bg-[#31572C] text-white ml-auto shadow-md"
                }`}
              >
                {/* Regular Bot / User Text */}
                {m.type !== "batch" && (
                  <div>
                    <p className="whitespace-pre-wrap">{m.text}</p>
                    {m.sender === "bot" && renderToolBadges(m.toolsExecuted)}
                  </div>
                )}

                {/* Batch Status Card */}
                {m.type === "batch" && (
                  <>
                    <div className="text-xs leading-relaxed whitespace-pre-wrap font-mono bg-[#f8fae3] p-3 rounded-xl border border-[#90A955]/30 text-[#31572C]">
                      {`📦 Batch Status Record

🆔 Batch ID: ${m.batch.batchId}
🌱 Species: ${m.batch.speciesId}
🟢 Status: ${m.batch.status}
🕒 Updated: ${m.batch.lastUpdated}
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
                        className="mt-3 w-full bg-[#90A955] hover:bg-[#4F772D] text-white py-2.5 rounded-xl transition text-xs font-bold shadow-sm cursor-pointer"
                      >
                        {loading ? "⏳ Opening..." : "📄 View Blockchain Certificate"}
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex">
                <TypingDots />
              </div>
            )}

            <div ref={chatEndRef}></div>
          </div>

          {/* Animated Slide-Up Inactivity Popup (Ultra Premium Glassmorphism) */}
          <AnimatePresence>
            {showInactivityPopup && sessionState !== "ended" && (
              <motion.div
                initial={{ y: 80, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 80, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-16 left-3 right-3 bg-white/95 backdrop-blur-xl border border-[#90A955]/40 shadow-2xl rounded-3xl p-5 z-40 overflow-hidden"
              >
                {/* Top Ambient Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#90A955] via-[#4F772D] to-[#31572C]" />

                <div className="flex items-start gap-3.5 pt-1">
                  <div className="w-10 h-10 rounded-2xl bg-[#ECF39E]/60 text-[#31572C] flex items-center justify-center flex-shrink-0 font-bold shadow-sm border border-[#90A955]/20">
                    <Clock size={20} className="text-[#31572C]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-extrabold text-[#31572C] tracking-tight">
                      Are you still here?
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      You haven't sent a message in 2 minutes. Would you like to keep chatting or end the session?
                    </p>

                    <div className="flex items-center gap-2.5 mt-4">
                      <button
                        onClick={() => {
                          setShowInactivityPopup(false);
                          resetInactivityTimer();
                        }}
                        className="flex-1 bg-[#90A955] hover:bg-[#4F772D] text-white py-2 px-4 rounded-xl text-xs font-extrabold transition-all shadow-md cursor-pointer text-center"
                      >
                        Continue Session
                      </button>

                      <button
                        onClick={handleEndChat}
                        className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200/60 py-2 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
                      >
                        End Chat
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Area: Input Bar or Restart Option */}
          {sessionState === "ended" ? (
            <div className="p-4 bg-white border-t border-gray-200 text-center">
              <button
                onClick={handleRestartChat}
                className="w-full flex items-center justify-center gap-2 bg-[#90A955] hover:bg-[#4F772D] text-white py-3 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
              >
                <RefreshCw size={15} />
                Start New Chat Session
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-white border-t border-gray-150">
              <input
                type="text"
                placeholder="Ask a question or enter Batch ID..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-xs sm:text-sm focus:border-[#90A955] focus:ring-1 focus:ring-[#90A955] transition"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessageToAPI()}
                disabled={loading}
              />
              <button
                onClick={() => sendMessageToAPI()}
                disabled={loading || !message.trim()}
                className="bg-[#90A955] hover:bg-[#4F772D] disabled:opacity-40 text-white p-2.5 rounded-xl transition cursor-pointer shadow-sm flex items-center justify-center"
                title="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
