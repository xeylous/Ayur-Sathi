"use client";
import Image from "next/image";

export default function AyurSaathiOrganizationalModel() {
  return (
    <div className=" max-w-5xl mx-auto text-gray-800">
      {/* Title */}
      <h2 className="text-2xl font-bold text-blue-700 mb-2">Organizational Model</h2>
      <h3 className="text-xl font-semibold mb-4">Farmers & Ayurसाथी</h3>

      {/* Visual Section */}
      <Image
        src="/organizational.png" // replace with actual path
        alt="Farmers and Wild Collectors"
        width={600}
        height={400}
        className="rounded-lg shadow-lg w-full h-auto object-contain mb-6"
      />

      {/* Description */}
      <p className="mb-6">
        Farmers and wild collectors are the primary issuers of herb collection data in
        the AyurSaathi ecosystem. Using SMS or a lightweight mobile app, they provide
        geo-tagged details of collected herbs, including type, GPS location, timestamp,
        and identity verification. This data becomes the foundation for provenance,
        ensuring that every herb batch entering the supply chain is authentic and
        traceable.
      </p>

      {/* User Benefits */}
      <div className="mb-6">
        <h4 className="font-semibold text-lg mb-2">User Benefits:</h4>
        <p>
          Farmers can directly record and sell their harvested herbs at
          government-assigned rates without middlemen. This system ensures fair pricing,
          quick payments, and transparent access to the market. Consumers benefit by
          gaining confidence in the authenticity of herbs through QR-based verification.
        </p>
      </div>

      {/* Security Compliance */}
      <div className="mb-6">
        <h4 className="font-semibold text-lg mb-2">Security Compliance:</h4>
        <p>
          All herb collection data is digitally signed and stored on blockchain with
          tamper-proof records. Farmers log in using OTP-based verification, ensuring
          identity authenticity. This prevents fake entries and ensures that only
          verified farmers and collectors can contribute data to the system.
        </p>
      </div>

      {/* Real-World Examples */}
      <div>
        <h4 className="font-semibold text-lg mb-2">Real-World Examples:</h4>
        <p>
          A farmer in Jharkhand can geo-tag the collection of Ashwagandha roots, which
          is then verified by a lab and listed in the AyurSaathi marketplace. Consumers
          purchasing the herb can scan its QR code to see the farmer’s profile, harvest
          location, and lab certification, ensuring transparency and fair trade.
        </p>
      </div>
    </div>
  );
}
