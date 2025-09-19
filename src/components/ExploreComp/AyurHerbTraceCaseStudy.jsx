"use client";

export default function AyurSaathiCaseStudy() {
  return (
    <div className="p-0 max-w-4xl  text-gray-800">
      {/* Title */}
      <h2 className="text-2xl font-bold text-blue-700 mb-2">Case Study</h2>
      <h3 className="text-xl font-semibold mb-4">Agriculture & Ayurveda</h3>

      {/* Problem Statement */}
      <div className="mb-6">
        <h4 className="font-semibold text-lg mb-2">Problem Statement:</h4>
        <p>
          The supply chain for Ayurvedic herbs is fragmented, involving smallholder
          farmers, wild collectors, and multiple intermediaries. This leads to
          challenges in ensuring authenticity, quality, and fair pricing. Lack of
          geo-tagged data, manual record-keeping, and opaque provenance increase the
          risk of adulteration, fraud, and exploitation of farmers. Consumers also
          struggle to trust the origin and quality of the herbs they purchase.
        </p>
      </div>

      {/* Solution & Impact */}
      <div>
        <h4 className="font-semibold text-lg mb-2">Solution & Impact:</h4>
        <ul className="list-disc ml-6 space-y-2">
          <li>
            <strong>Ayurसाथी</strong> introduces a blockchain-based traceability
            platform that records every step from
            collection to consumer, ensuring end-to-end authenticity.
          </li>
          <li>
            Farmers and wild collectors can geo-tag their herb collections, upload
            details, and sell directly at government-assigned rates, ensuring fair
            pricing.
          </li>
          <li>
            Labs and processors upload quality assurance results, with certificates
            stored securely and hashes saved on blockchain for tamper-proof
            verification.
          </li>
          <li>
            Each herb batch generates a unique QR code that consumers can scan to
            instantly view farm location, farmer profile, collection date, herb
            type, and lab certificate.
          </li>
          <li>
            A built-in herb marketplace enables consumers to purchase directly,
            increasing trust and transparency while promoting sustainable trade.
          </li>
        </ul>
      </div>
    </div>
  );
}
