import React from "react";
import { QrCode } from "lucide-react";

export default function Home_2() {
  return (
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
            <button className="flex items-center justify-center gap-2 bg-[#31572C] text-white px-5 py-2 rounded-lg hover:bg-[#4F772D] transition">
              <QrCode size={18} />
              Scan demo batch
            </button>
            <button className="bg-[#31572C] text-white px-5 py-2 rounded-lg hover:bg-[#4F772D] transition">
              Explore APIs
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
