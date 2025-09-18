"use client";

import Image from "next/image";

export default function WhyAyurSathiCitizens() {
  return (
    <section className="w-full bg-[#ECF39E] rounded-xl shadow-md p-6 md:p-10">
      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-4">
        Why AyurSaathi?
      </h2>

      <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
        For Citizens
      </h3>

      {/* Intro text */}
      <p className="text-gray-700 leading-relaxed mb-4">
        AyurSaathi is designed to empower citizens with **secure, transparent, 
        and reliable access to Ayurvedic herbal product information**. From 
        ensuring product authenticity to promoting consumer trust, AyurSaathi 
        bridges the gap between traditional wisdom and modern technology.
      </p>

      {/* Image Section */}
      <div className="w-full flex justify-center mb-6">
        <Image
          src="/citizenComp.png" // replace with your actual image path
          alt="AyurSaathi Citizens"
          width={200}
          height={300}
          className="rounded-lg shadow-lg w-full h-auto object-cover"
        />
      </div>

      {/* Features Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 border rounded-lg hover:shadow-md transition">
          <h4 className="font-semibold text-green-700 mb-2">Access Anytime, Anywhere</h4>
          <p className="text-gray-600 text-sm">
            Verify the authenticity of Ayurvedic products and supply chains with 
            just a few taps — anytime, anywhere.
          </p>
        </div>

        <div className="p-4 border rounded-lg hover:shadow-md transition">
          <h4 className="font-semibold text-green-700 mb-2">Trust & Transparency</h4>
          <p className="text-gray-600 text-sm">
            Blockchain-backed traceability ensures every product is genuine, 
            safe, and sourced responsibly.
          </p>
        </div>

        <div className="p-4 border rounded-lg hover:shadow-md transition">
          <h4 className="font-semibold text-green-700 mb-2">Effortless Verification</h4>
          <p className="text-gray-600 text-sm">
            Scan QR codes on packaging to instantly view origin, lab test 
            reports, and certifications.
          </p>
        </div>

        <div className="p-4 border rounded-lg hover:shadow-md transition">
          <h4 className="font-semibold text-green-700 mb-2">Consumer Empowerment</h4>
          <p className="text-gray-600 text-sm">
            Citizens gain confidence in purchasing herbal products that meet 
            both traditional and regulatory standards.
          </p>
        </div>

        <div className="p-4 border rounded-lg hover:shadow-md transition">
          <h4 className="font-semibold text-green-700 mb-2">Accelerated Access</h4>
          <p className="text-gray-600 text-sm">
            Direct access to verified information improves safety, trust, and 
            faster decision-making.
          </p>
        </div>

        <div className="p-4 border rounded-lg hover:shadow-md transition">
          <h4 className="font-semibold text-green-700 mb-2">Simplified Services</h4>
          <p className="text-gray-600 text-sm">
            A single platform for authentication, certification checks, and 
            Ayurvedic knowledge.
          </p>
        </div>
      </div>
    </section>
  );
}
