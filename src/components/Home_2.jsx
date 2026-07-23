"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QrCode, ArrowRight, Eye, ShieldAlert } from "lucide-react";
import { toast, Toaster } from "sonner";
import { motion } from "framer-motion";
import QRScannerModal from "./QRScannerModal";

export default function Home_2() {
  const router = useRouter();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const DEMO_BATCH_ID = "ASW-2025-1962";

  const handleDemoBatchClick = async () => {
    setIsNavigating(true);
    toast.loading("Loading demo batch...");

    try {
      router.push(`/batchid/${DEMO_BATCH_ID}`);
      toast.dismiss();
      toast.success("Navigating to demo batch");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to load demo batch");
      setIsNavigating(false);
    }
  };

  const handleQRScanSuccess = (batchId) => {
    toast.success(`Scanned batch: ${batchId}`);
    router.push(`/batchid/${batchId}`);
  };

  return (
    <>
      <Toaster position="top-center" richColors />

      <section className="bg-[#ECF39E]/30 py-20 relative overflow-hidden">
        {/* Soft elegant radial highlights (no dark background cards) */}
        {/* <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#90A955]/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#ECF39E]/50 blur-3xl pointer-events-none" /> */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* LEFT COLUMN: Clean, Elegant Typography & Copy (col-span-7) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4F772D]/8 text-[#4F772D] text-[10px] font-bold uppercase tracking-widest border border-[#90A955]/20"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#4F772D] animate-ping" />
                Live Pilot Sandbox
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl font-extrabold text-[#31572C] tracking-tight leading-[1.05]"
              >
                Experience the <br />
                <span className="relative">
                  <span className="relative z-10 text-[#4F772D]">Ashwagandha</span>
                  <span className="absolute bottom-1.5 left-0 right-0 h-3 bg-[#ECF39E]/80 -z-0 rounded-sm" />
                </span>{" "}
                Demonstration
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-xl"
              >
                Explore live supply chain audits in our active sandbox. Access trace tracking modules, audit certificates, and simulate recall alerts mapped directly on the permissioned ledger.
              </motion.p>
            </div>

            {/* RIGHT COLUMN: Ultra-Premium Light Minimalist Action Box (col-span-5) */}
            <div className="lg:col-span-5 w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white/80 backdrop-blur-md border border-[#90A955]/20 shadow-2xl shadow-[#31572C]/5 rounded-3xl p-8 space-y-6 relative group"
              >
                {/* Decorative glow highlight on card top border */}
                <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-[#4F772D]/35 to-transparent" />

                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">
                    Select Interactive Option
                  </span>
                  <h3 className="text-xl font-extrabold text-[#31572C]">
                    Begin Platform Audit
                  </h3>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleDemoBatchClick}
                    disabled={isNavigating}
                    className="w-full flex items-center justify-between bg-[#90A955] hover:bg-[#4F772D] text-white px-5 py-3.5 rounded-xl font-bold text-xs shadow-md transition-all duration-300 cursor-pointer group/btn"
                  >
                    <span className="flex items-center gap-2.5">
                      <Eye size={15} />
                      {isNavigating ? "Opening sandbox..." : "Initialize Sandbox"}
                    </span>
                    <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => setIsQRModalOpen(true)}
                    className="w-full flex items-center justify-between bg-white hover:bg-gray-50 border border-gray-200 text-[#31572C] px-5 py-3.5 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <QrCode size={15} />
                      Simulate QR Scan
                    </span>
                    <ArrowRight size={13} className="opacity-40" />
                  </button>
                </div>

                <div className="text-[10px] text-gray-400 text-center leading-relaxed">
                  Sandbox logs update instantly to reflect mock state and transaction audits.
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        onScanSuccess={handleQRScanSuccess}
      />
    </>
  );
}
