"use client";

import { ShoppingBag, Clock } from "lucide-react";

export default function Marketplace() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#f8fae3]/30 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#f8fae3]/30 rounded-full blur-3xl opacity-40"></div>

      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#90A955] text-white font-semibold">
          <ShoppingBag className="w-5 h-5" />
          Marketplace
        </div>

        <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-900">
          AyurHerbTrace Marketplace
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Soon you'll be able to explore ethically sourced Ayurvedic herbs with 
          full blockchain traceability — from farm to pharmacy.
        </p>

        {/* Coming Soon Box */}
        <div className="mt-8 p-6 rounded-xl border bg-white shadow-md inline-flex flex-col items-center gap-3">
          <Clock className="w-10 h-10 text-[#90A955]" />
          <span className="text-xl font-semibold text-brand-900">
            Coming Soon
          </span>
          <p className="text-sm text-muted-foreground max-w-sm">
            We're building a trusted marketplace to connect farmers, processors 
            and consumers directly.
          </p>
        </div>

        {/* Optional CTA */}
        <div className="mt-8">
          <button className="px-6 py-3 rounded-lg bg-[#90A955] hover:bg-[#4F772D] text-white font-medium transition">
            Notify Me
          </button>
        </div>
      </div>
    </section>
  );
}
