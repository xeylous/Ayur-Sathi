"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QrCode } from "lucide-react";
import { toast, Toaster } from "sonner";
import QRScannerModal from "./QRScannerModal";
import APIDocsModal from "./APIDocsModal";

export default function Home_2() {
  const router = useRouter();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isAPIDocsOpen, setIsAPIDocsOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const DEMO_BATCH_ID = "ASW-2025-1962";

  const handleDemoBatchClick = async () => {
    setIsNavigating(true);
    toast.loading("Loading demo batch...");
    
    try {
      // Navigate to the demo batch page
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

  const handleExploreAPIs = () => {
    setIsAPIDocsOpen(true);
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      
      <section className="bg-[#ECF39E]/30 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[#90A955]/30 bg-[#ECF39E]/30 shadow-sm p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Text Section */}
            <div>
              <h2 className="text-2xl font-bold text-[#31572C]">
                Join the Ashwagandha pilot
              </h2>
              <p className="text-gray-700 mt-2 max-w-2xl">
                End-to-end demo across a smallholder cooperative and processor —
                includes recall simulation and consumer scan analytics.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDemoBatchClick}
                disabled={isNavigating}
                className="flex items-center justify-center gap-2 bg-[#31572C] text-white px-5 py-2 rounded-lg hover:bg-[#4F772D] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <QrCode size={18} />
                {isNavigating ? "Loading..." : "View Demo Batch"}
              </button>
              
              <button
                onClick={() => setIsQRModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-white text-[#31572C] border-2 border-[#31572C] px-5 py-2 rounded-lg hover:bg-[#31572C] hover:text-white transition"
              >
                <QrCode size={18} />
                Scan QR Code
              </button>
              
              <button
                onClick={handleExploreAPIs}
                className="bg-[#31572C] text-white px-5 py-2 rounded-lg hover:bg-[#4F772D] transition"
              >
                Explore APIs
              </button>
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

      {/* API Documentation Modal */}
      <APIDocsModal
        isOpen={isAPIDocsOpen}
        onClose={() => setIsAPIDocsOpen(false)}
      />
    </>
  );
}
