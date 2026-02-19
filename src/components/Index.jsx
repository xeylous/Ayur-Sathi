"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  QrCode,
  MapPin,
  Factory,
  FlaskConical,
  ShieldCheck,
} from "lucide-react";
import ImageSlider from "./ImageSlider";
import LandingSkeleton from "./LandingSkeleton";

function IndexContent() {
  const searchParams = useSearchParams();
  const [batch, setBatch] = useState("");
  const [batchData, setBatchData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const param = searchParams.get("batch");
    if (param) setBatch(param);
  }, [searchParams]);
  const router = useRouter();

  // Function to fetch batch details from API
  const fetchBatchDetails = async () => {
    if (!batch.trim()) {
      setError("Please enter a batch ID");
      return;
    }

    setLoading(true);
    setError(null);
    setBatchData(null);

    try {
      const response = await fetch(`/api/public/batch?batchId=${encodeURIComponent(batch)}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch batch details");
      }

      // Decode the base64 encoded data
      const decodedData = JSON.parse(atob(data.encoded));
      setBatchData(decodedData);
      
      // Navigate to batch details page
      router.push(`/batchid/${encodeURIComponent(batch)}`);
    } catch (err) {
      setError(err.message || "An error occurred while fetching batch details");
      console.error("Batch fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const highlights = useMemo(
    () => [
      {
        icon: MapPin,
        title: "Geo-tagged Harvests",
        desc: "GPS, timestamp, species & moisture",
      },
      {
        icon: Factory,
        title: "Processing Steps",
        desc: "Drying, grinding, storage conditions",
      },
      {
        icon: FlaskConical,
        title: "Lab QA",
        desc: "Moisture, pesticides, DNA barcode",
      },
      {
        icon: ShieldCheck,
        title: "Smart Compliance",
        desc: "Geo-fencing, seasons, limits",
      },
    ],
    []
  );

  return (
    <div className="bg-[#ECF39E]/30 overflow-hidden">
      {/* HERO */}
      <section className="relative overflow-hidden w-full">
        {/* Background blobs */}
        <div className="absolute inset-0 -z-10 opacity-30" aria-hidden>
          <div className="absolute -top-20 -left-20 size-[400px] rounded-full blur-3xl bg-brand-100" />
          <div className="absolute -bottom-10 -right-10 size-[500px] rounded-full blur-3xl bg-brand-400/40" />
        </div>

        <div className="max-w-7xl mx-auto px-3 py-12 md:py-16">
          {/* grid for text + image */}
          <div className="grid gap-10 md:gap-16 lg:gap-24 xl:gap-32 2xl:gap-40 lg:grid-cols-2 lg:items-center">
            {/* Left: Text content */}
            <div className="mx-auto lg:mx-0 text-center lg:text-left">
              <span className="inline-block px-3 py-1 rounded-full text-xs bg-[#90A955] font-semibold bg-brand-100 text-brand-900">
                Blockchain • Geo-Tagging • FHIR-style
              </span>

              <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-brand-900">
                Transparent Ayurvedic herb traceability
              </h1>

              <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                Permissioned blockchain with smart contracts, geo-fenced harvest
                rules and QR-powered consumer provenance — built for ethical
                sourcing and rapid audits.
              </p>

              {/* Input + Buttons */}
              <div
                className="mt-6 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
                id="try"
              >
                <div className="flex-1 min-w-0">
                  <label htmlFor="batch" className="sr-only">
                    Batch
                  </label>
                  <input
                    id="batch"
                    value={batch}
                    onChange={(e) => {
                      setBatch(e.target.value);
                      setError(null); // Clear error when user types
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') fetchBatchDetails();
                    }}
                    className="w-full h-11 rounded-md border bg-white px-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
                    placeholder="Enter or paste batch/QR code"
                    disabled={loading}
                  />
                </div>

                <button
                  onClick={fetchBatchDetails}
                  disabled={loading}
                  className="h-11 px-4 flex items-center justify-center rounded-md border bg-[#90A955] hover:bg-[#4F772D] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Loading..." : "View Details"}
                </button>

                <button className="flex items-center justify-center gap-2 h-11 px-4 rounded-md bg-[#90A955] hover:bg-[#4F772D] hover:text-white border text-black hover:bg-brand-700">
                  <QrCode className="w-4 h-4" />
                  Scan QR
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-3 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm text-center lg:text-left">
                  {error}
                </div>
              )}

              {/* Highlights */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 text-sm px-3 sm:px-0 justify-items-center lg:justify-items-start">
                {highlights.map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="flex items-center gap-3 rounded-lg border bg-card p-3 w-full max-w-xs"
                  >
                    <div className="h-9 w-9 rounded-md bg-brand-600 text-white grid place-items-center flex-shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">{title}</div>
                      <div className="text-muted-foreground text-xs">
                        {desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Image section */}
            <div className="lg:flex justify-center lg:justify-end mt-8 lg:mt-0 hidden">
              <ImageSlider />
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM & SOLUTION */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-3 grid gap-8 md:gap-12 lg:gap-16 xl:gap-24 2xl:gap-32 md:grid-cols-2">
          {/* Background Card */}
          <div className="rounded-xl border bg-card p-6 text-center md:text-left">
            <div className="text-brand-900 font-semibold">Background</div>
            <h2 className="text-2xl font-bold mt-2">
              Fragmented, opaque herbal supply chains
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc pl-5">
              <li>
                Smallholders and intermediaries create inconsistent records
              </li>
              <li>Risks: mislabeling, adulteration, and over-harvesting</li>
              <li>Opaque geographic provenance undermines compliance</li>
            </ul>
          </div>

          {/* Solution Card */}
          <div className="rounded-xl border bg-card p-6 text-center md:text-left">
            <div className="text-brand-900 font-semibold">Solution</div>
            <h2 className="text-2xl font-bold mt-2">
              Blockchain traceability with geo-tagging
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc pl-5">
              <li>Immutable ledger records every event with GPS and time</li>
              <li>Smart contracts enforce NMPB harvesting & seasonal rules</li>
              <li>FHIR-style metadata bundles enable interoperability</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

// Wrap with Suspense for useSearchParams
export default function Index() {
  return (
    <Suspense fallback={<LandingSkeleton />}>
      <IndexContent />
    </Suspense>
  );
}
