"use client";

import Image from "next/image";

export default function WhyAyurSathiCitizens() {
  return (
    <section
      className="w-full bg-[#ECF39E] rounded-xl shadow-md p-6 md:px-10 md:py-6 min-h-[450px] overflow-auto hide-scrollbar mt-[-1rem] h-fit"
    >
      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-4">
        Why AyurSaathi?
      </h2>

      <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
        For Citizens
      </h3>

      {/* Intro text */}
      <p className="text-gray-700 leading-relaxed mb-4">
        AyurSaathi is designed to empower citizens with <b>secure, transparent, 
        and reliable access to Ayurvedic herbal product information</b>. From 
        ensuring product authenticity to promoting consumer trust, AyurSaathi 
        bridges the gap between traditional wisdom and modern technology.
      </p>

      {/* Image Section */}
      <div className="w-full flex justify-center mb-6">
        <Image
          src="/citizenComp.png"
          alt="AyurSaathi Citizens"
          width={200}
          height={300}
          className="rounded-lg shadow-lg w-full h-auto object-cover"
        />
      </div>

      {/* Features Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Access Anytime, Anywhere",
            desc: "Verify the authenticity of Ayurvedic products and supply chains with just a few taps — anytime, anywhere.",
          },
          {
            title: "Trust & Transparency",
            desc: "Blockchain-backed traceability ensures every product is genuine, safe, and sourced responsibly.",
          },
          {
            title: "Effortless Verification",
            desc: "Scan QR codes on packaging to instantly view origin, lab test reports, and certifications.",
          },
          {
            title: "Consumer Empowerment",
            desc: "Citizens gain confidence in purchasing herbal products that meet both traditional and regulatory standards.",
          },
          {
            title: "Accelerated Access",
            desc: "Direct access to verified information improves safety, trust, and faster decision-making.",
          },
          {
            title: "Simplified Services",
            desc: "A single platform for authentication, certification checks, and Ayurvedic knowledge.",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-4 border rounded-lg hover:shadow-md transition"
          >
            <h4 className="font-semibold text-green-700 mb-2">{item.title}</h4>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
