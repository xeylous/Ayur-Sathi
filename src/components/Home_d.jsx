"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { UserPlus, Building2, Smartphone, ArrowRight, Play, Download } from "lucide-react";

export default function Home_d() {
  const router = useRouter();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-60px" });

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <main 
      ref={containerRef}
      className="hidden bg-[#ECF39E]/30 md:flex items-center justify-center p-6 pb-20 relative overflow-hidden"
    >
      {/* Soft blur visual blobs behind */}
      <div className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full bg-[#90A955]/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* LEFT COLUMN: Premium Network Partner Callout */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative bg-gradient-to-br from-[#31572C] to-[#4F772D] rounded-3xl p-8 sm:p-10 shadow-lg border border-[#4F772D]/20 flex flex-col justify-between overflow-hidden group"
        >
          {/* Subtle overlay texture grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30" />
          
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECF39E]/15 text-[#ECF39E] text-[10px] font-bold uppercase tracking-widest mb-6 border border-[#ECF39E]/20">
              Partnership Network
            </span>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Join the AyurSaathi Blockchain
            </h2>
            
            <p className="mt-4 text-sm text-[#ECF39E]/80 leading-relaxed max-w-md">
              Register as a Farmer, Quality Lab, or Processing Partner. Contribute verified data and access premium organic distribution channels.
            </p>
          </div>

          <div className="relative z-10 mt-10 flex flex-wrap gap-4 items-center">
            <button
              onClick={handleRegister}
              className="inline-flex items-center gap-2 bg-[#ECF39E] hover:bg-[#dce88a] text-[#31572C] text-sm font-extrabold px-6 py-3.5 rounded-xl shadow-md transition-all cursor-pointer group/btn"
              aria-label="Register as Farmer"
            >
              <UserPlus size={16} />
              Register Now
              <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={handleRegister}
              className="inline-flex items-center gap-2 bg-transparent text-white border border-white/30 hover:border-white hover:bg-white/5 text-sm font-bold px-6 py-3.5 rounded-xl transition-all cursor-pointer"
              aria-label="Partner with Us"
            >
              <Building2 size={16} />
              Partner with Us
            </button>
          </div>

          {/* Decorative Leaf Graphic in corner */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 opacity-15 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-transform duration-750">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full stroke-white stroke-[2.5]">
              <path d="M10,90 Q50,50 90,10" />
              <path d="M90,10 Q60,35 50,50 Q40,65 10,90" />
              <path d="M90,10 Q65,15 50,30 Q35,45 10,90" />
            </svg>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Modern Mobile App Showcase */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-[#90A955]/20 flex flex-col lg:flex-row items-center gap-8 justify-between relative overflow-hidden"
        >
          <div className="flex-1 flex flex-col justify-between h-full">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#90A955]/15 text-[#4F772D] text-[10px] font-bold uppercase tracking-widest mb-6 border border-[#90A955]/20">
                On the go
              </span>
              
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#31572C]">
                Get the App
              </h3>
              
              <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-xs">
                Track batches, manage crop uploads, and access lab certificates directly from your mobile device.
              </p>
            </div>

            {/* Quick Action buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Google Play link coming soon!");
                }}
                className="inline-flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-[#31572C] border border-gray-200 text-xs font-bold px-4 py-3 rounded-xl transition cursor-pointer"
              >
                <Play size={13} fill="currentColor" /> Play Store
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("App Store link coming soon!");
                }}
                className="inline-flex items-center justify-center gap-2 bg-[#31572C] hover:bg-[#4F772D] text-white text-xs font-bold px-4 py-3 rounded-xl transition cursor-pointer"
              >
                <Download size={13} /> App Store
              </a>
            </div>
          </div>

          {/* QR Display Container */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2 bg-[#f8fae3]/40 border border-[#90A955]/20 p-4 rounded-2xl shadow-inner relative group">
            <span className="text-[9px] uppercase font-bold tracking-wider text-[#4F772D]/60 select-none">
              Scan to Download
            </span>
            <div className="relative overflow-hidden rounded-xl border border-gray-100 p-2.5 bg-white">
              <img
                src="/frame.png"
                alt="QR Code"
                className="w-28 h-28 object-contain"
              />
              {/* Subtle visual scan line */}
              <div className="absolute left-0 right-0 h-0.5 bg-[#90A955]/40 top-0 group-hover:top-full transition-all duration-2000 ease-in-out pointer-events-none" />
            </div>
          </div>

        </motion.div>
        
      </div>
    </main>
  );
}
