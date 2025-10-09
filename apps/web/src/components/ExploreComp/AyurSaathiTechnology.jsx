"use client";

import Image from "next/image";

export default function AyurSaathiEcosystem() {
  return (
    <div className="p-6 max-w-5xl mx-auto text-gray-800">
      {/* Title */}
      <h2 className="text-2xl font-bold text-blue-700 mb-2">
        Technology Overview – The Engine Behind AyurSaathi
      </h2>
      <h3 className="text-xl font-semibold mb-4">AyurSaathi Ecosystem</h3>

      {/* Intro */}
      <p className="mb-4">
        At the heart of AyurSaathi is <strong>AyurHerbTrace</strong>, a
        blockchain-based traceability and marketplace system that simplifies how
        farmers, labs, and consumers interact in the Ayurvedic herb supply
        chain. By eliminating fraud, manual errors, and middlemen exploitation,
        AyurSaathi ensures authenticity, transparency, and fair trade in real
        time. The system leverages blockchain, cloud, and QR-code technologies
        to create a secure, efficient, and trusted ecosystem for herb
        provenance, lab verification, and consumer trust.
      </p>

      {/* Features List */}
      <ul className="list-disc ml-6 mb-6 space-y-2">
        <li>
          <strong>Geo-Tagging:</strong> Farmers record collection events with GPS,
          timestamp, and herb details.
        </li>
        <li>
          <strong>Blockchain Records:</strong> Every batch is immutably logged on
          Ethereum testnet with hash verification.
        </li>
        <li>
          <strong>Lab Certification:</strong> QA results are uploaded with digital
          certificates stored securely in the cloud.
        </li>
        <li>
          <strong>QR Code Provenance:</strong> Consumers scan unique QR codes to
          view farm origin, collector profile, and lab test details.
        </li>
        <li>
          <strong>Secure Marketplace:</strong> Herbs listed at government-assigned
          rates; consumers purchase directly with UPI/Razorpay.
        </li>
        <li>
          <strong>Analytics Dashboard:</strong> Real-time insights on scans,
          batches, lab approvals, and order history.
        </li>
      </ul>

      {/* Ecosystem Diagram Placeholder */}
      <div className="flex justify-center my-8">
        {/* <div className="border-2 border-dashed border-gray-400 rounded-lg p-12 text-center text-gray-500">
          🌿 [ Ecosystem Flow Diagram Placeholder ]  
          <br />
          (Farmer → Lab → Blockchain → QR → Consumer → Marketplace)
        </div> */}
        <Image
          src="/Framework.png"
          alt="AyurSaathi Ecosystem Diagram"
          width={600}
          height={400}
          className="rounded-lg shadow-lg w-1/2 h-auto object-contain"
        />
      </div>

      {/* Additional Sections */}
      <div className="mb-6">
        <h4 className="font-semibold text-lg mb-2">Trusted Network</h4>
        <p>
          AyurSaathi runs on a secure, government-backed blockchain and cloud
          infrastructure. Only verified farmers, labs, and consumers can
          interact, ensuring trust at every stage of the supply chain.
        </p>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-lg mb-2">Machine Readable</h4>
        <p>
          Herb provenance records, lab reports, and certificates are stored in
          machine-readable formats like JSON/XML. This ensures seamless
          integration across apps, reducing manual intervention and errors.
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-lg mb-2">Tamper Evident</h4>
        <p>
          Every document and herb record is hashed and timestamped on blockchain,
          making them immutable and verifiable. This eliminates the possibility
          of forgery or manipulation in the supply chain.
        </p>
      </div>
    </div>
  );
}
