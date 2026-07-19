"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Factory,
  FlaskConical,
  QrCode,
  ShieldCheck,
  Network,
  BarChart,
  Smartphone,
  Boxes,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

/* ─── 4-Step Interactive Journey Details ─── */
const steps = [
  {
    icon: MapPin,
    title: "Collection & Geo-Tagging",
    desc: "At the moment of harvest, farmers log geographic coordinates, species identification, and initial moisture levels. This establishes the absolute starting point of the supply chain.",
    highlights: ["GPS coordinates locked", "Moisture verification", "Species verification"],
    bgImage: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?q=80&w=600&auto=format&fit=crop",
  },
  {
    icon: FlaskConical,
    title: "Accredited Lab Certification",
    desc: "Samples are analyzed for heavy metals, moisture, pesticide residue, and DNA barcode profiles. The test reports are signed and cryptographically tied to the batch.",
    highlights: ["Pesticide-free certified", "DNA Barcoding", "Moisture compliance"],
    bgImage: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=600&auto=format&fit=crop",
  },
  {
    icon: Factory,
    title: "Processing & Refining",
    desc: "Approved raw materials are processed. Drying, cleaning, grinding, and formulation steps log temperature, relative humidity, and facility credentials.",
    highlights: ["Controlled temperature", "Operator credentialing", "Humidity mapping"],
    bgImage: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?q=80&w=600&auto=format&fit=crop",
  },
  {
    icon: QrCode,
    title: "Consumer Transparency Label",
    desc: "On-chain smart contracts generate a unique public QR code label. Consumers scan this label on store shelves to access the verified farm-to-shelf story.",
    highlights: ["Immutable QR mapping", "Instant scans", "Blockchain provenance"],
    bgImage: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=600&auto=format&fit=crop",
  },
];

/* ─── Supporting Platform Core Capabilities (Simple elegant cards) ─── */
const capabilities = [
  { icon: ShieldCheck, title: "Smart Compliance", desc: "NMPB rules and harvesting seasons auto-enforced." },
  { icon: Network, title: "Permissioned Ledger", desc: "Role-based validator nodes for farmers, labs, and buyers." },
  { icon: Boxes, title: "FHIR Metadata Schema", desc: "Interoperable data structure mapping all supply chain actions." },
  { icon: BarChart, title: "Dashboards & Audits", desc: "Real-time query metrics, QA statuses, and yield statistics." },
  { icon: Smartphone, title: "Offline SMS Gateways", desc: "Reliable SMS communication channel for remote agricultural areas." },
  { icon: Factory, title: "ERP Connector APIs", desc: "Simple REST integration interfaces for factory software packages." },
];

export default function Home_1() {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const nextStep = () => setActiveStep((prev) => (prev + 1) % steps.length);
  const prevStep = () => setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);

  // Auto-play interval for the horizontal interactive story
  useEffect(() => {
    const timer = setInterval(nextStep, 6000);
    return () => clearInterval(timer);
  }, []);

  const ActiveIcon = steps[activeStep].icon;

  return (
    <section ref={containerRef} className="relative bg-[#ECF39E]/30 py-20 overflow-hidden">
      
      {/* Decorative Blur Background Accents */}
      <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-[#90A955]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-[#ECF39E]/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── SECTION HEADER ── */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#90A955]/15 text-[#4F772D] text-xs font-semibold mb-3 border border-[#90A955]/20"
          >
            <Sparkles size={13} /> Supply Chain Traceability
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#31572C]"
          >
            How it works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-3 text-sm sm:text-base text-gray-600 max-w-xl mx-auto"
          >
            Explore our end-to-end provenance architecture that maps every batch securely on the blockchain.
          </motion.p>
        </div>

        {/* ── INTERACTIVE JOURNEY HORIZONTAL SLIDER ── */}
        <div className="bg-white rounded-3xl border border-[#90A955]/20 shadow-xl overflow-hidden mb-20 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* LEFT COLUMN: Visual Media & Current Image (col-span-5) */}
            <div className="lg:col-span-5 relative h-64 lg:h-auto min-h-[300px] bg-gray-100 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeStep}
                  src={steps[activeStep].bgImage}
                  alt={steps[activeStep].title}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#31572C]/80 via-transparent to-transparent" />
              
              {/* Image Info Label */}
              <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#ECF39E]">
                  Verified Proof
                </span>
                <h4 className="text-base font-bold mt-1">Live Provenance Ledger</h4>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Details (col-span-7) */}
            <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
              
              {/* Stepper Navigation bar */}
              <div className="flex items-center gap-1.5 mb-8 overflow-x-auto pb-2">
                {steps.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
                      idx === activeStep
                        ? "bg-[#31572C] text-white shadow-md"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    <span>0{idx + 1}</span>
                    <span className="hidden sm:inline">{s.title.split(" ")[0]}</span>
                  </button>
                ))}
              </div>

              {/* Step Content */}
              <div className="min-h-[220px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#4F772D]/10 text-[#4F772D] flex items-center justify-center">
                        <ActiveIcon size={20} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#90A955] uppercase tracking-wider">Step {activeStep + 1} of 4</span>
                        <h3 className="text-xl font-bold text-[#31572C]">{steps[activeStep].title}</h3>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed">
                      {steps[activeStep].desc}
                    </p>

                    {/* Quality Badges */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {steps[activeStep].highlights.map((h, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center text-[11px] font-semibold bg-[#ECF39E]/20 text-[#31572C] px-2.5 py-1 rounded-md border border-[#90A955]/15"
                        >
                          ✓ {h}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slider Controls */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-8">
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevStep}
                    className="w-10 h-10 rounded-full border border-gray-200 hover:border-[#90A955] hover:bg-gray-50 flex items-center justify-center text-gray-600 transition cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={nextStep}
                    className="w-10 h-10 rounded-full border border-gray-200 hover:border-[#90A955] hover:bg-gray-50 flex items-center justify-center text-gray-600 transition cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="text-xs font-bold text-gray-400">
                  <span className="text-[#31572C]">0{activeStep + 1}</span> / 0{steps.length}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── CORE CAPABILITIES SECTION (Neat grid with clean animations) ── */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-xl font-bold text-[#31572C] mb-8 text-center sm:text-left">
            Platform Capabilities
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {capabilities.map((c, i) => {
              const CapIcon = c.icon;
              return (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="bg-white/60 hover:bg-white border border-[#90A955]/15 rounded-2xl p-5 hover:shadow-md hover:border-[#90A955]/30 transition-all duration-300 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#4F772D]/10 text-[#4F772D] flex items-center justify-center group-hover:bg-[#4F772D] group-hover:text-white transition-all duration-300 mb-4">
                    <CapIcon size={18} />
                  </div>
                  <h4 className="text-sm font-bold text-[#31572C]">{c.title}</h4>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{c.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
