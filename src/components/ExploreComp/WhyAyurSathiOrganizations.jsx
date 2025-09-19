"use client";

import Image from "next/image";

export default function WhyAyurSathiOrganizations() {
  return (
    <section className="w-full bg-[#ebf29d] rounded-xl shadow-md p-6 md:p-10">
      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-4">
        Why AyurSaathi?
      </h2>

      <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
        For Organizations
      </h3>

      {/* Image + Intro */}
      <div className="w-full flex justify-center mb-6">
        <Image
          src="/organization.png" // replace with actual path
          alt="AyurSaathi Organizations"
          width={700}
          height={350}
          className="rounded-lg shadow-lg w-full h-auto object-contain"
        />
      </div>

      {/* Features List */}
      <div className="space-y-5">
        <div>
          <h4 className="font-semibold text-green-700">
            Efficiency through Paperless Governance
          </h4>
          <p className="text-gray-600 text-sm md:text-base">
            Streamline supply chain processes with real-time access to verified
            herbal sourcing data and eliminate paperwork.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-green-700">
            Trusted Digital Transformation
          </h4>
          <p className="text-gray-600 text-sm md:text-base">
            Receive authenticated sourcing and lab reports directly from farmers
            and processors, ensuring reliability.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-green-700">
            Secure Digital Gateway
          </h4>
          <p className="text-gray-600 text-sm md:text-base">
            Serve as a trusted blockchain-backed link for verified herbal
            product exchange between suppliers and buyers.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-green-700">Instant Verification</h4>
          <p className="text-gray-600 text-sm md:text-base">
            Verify supply chain authenticity in seconds, enabling faster,
            reliable, and user-friendly business transactions.
          </p>
        </div>
      </div>
    </section>
  );
}
