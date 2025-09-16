"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  QrCode,
  MapPin,
  Factory,
  FlaskConical,
  ShieldCheck,
  Workflow,
  LineChart,
  Box,
} from "lucide-react";

export default function Index() {
  const [exampleFromServer, setExampleFromServer] = useState("");
  const searchParams = useSearchParams();
  const [batch, setBatch] = useState(searchParams.get("batch") || "ASHW-2025-0001");
  const router = useRouter();

  useEffect(() => {
    fetchDemo();
  }, []);

  const fetchDemo = async () => {
    try {
      const response = await fetch("/api/demo");
      const data = await response.json();
      setExampleFromServer(data.message);
    } catch (error) {
      // ignore errors
    }
  };

  const handleScan = () => {
    router.push(`/provenance?batch=${encodeURIComponent(batch)}`);
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
    <div className="bg-[#ECF39E]/30">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30" aria-hidden>
          <div className="absolute -top-20 -left-20 size-[400px] rounded-full blur-3xl bg-brand-100" />
          <div className="absolute -bottom-10 -right-10 size-[500px] rounded-full blur-3xl bg-brand-400/40" />
        </div>
        <div className="container py-16 md:p-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              {/* Badge replacement */}
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-brand-100 text-brand-900">
                Blockchain • Geo-Tagging • FHIR-style
              </span>

              <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-brand-900">
                Transparent Ayurvedic herb traceability
              </h1>

              <p className="mt-4 text-lg text-muted-foreground max-w-xl">
                Permissioned blockchain with smart contracts, geo-fenced harvest
                rules and QR-powered consumer provenance — built for ethical
                sourcing and rapid audits.
              </p>

              {/* Input + Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3" id="try">
                <div className="flex-1 min-w-0">
                  <label htmlFor="batch" className="sr-only">
                    Batch
                  </label>
                  <input
                    id="batch"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    className="w-full h-11 rounded-md border bg-white px-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
                    placeholder="Enter or paste batch/QR code"
                  />
                </div>

                <button
                  
                  className="flex items-center justify-center gap-2 h-11 px-4 rounded-md bg-gray-100 border text-black hover:bg-brand-700"
                >
                  <QrCode className="w-4 h-4" />
                  Scan QR
                </button>

                <Link
                  href="#"
                  className="h-11 px-4 flex items-center justify-center rounded-md border bg-gray-100 hover:bg-gray-200"
                >
                  View Details
                </Link>
              </div>

              {/* Highlights */}
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                {highlights.map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="flex items-center gap-3 rounded-lg border bg-card p-3"
                  >
                    <div className="h-9 w-9 rounded-md bg-brand-600 text-white grid place-items-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">{title}</div>
                      <div className="text-muted-foreground text-xs">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

                      
          </div>
        </div>
      </section>

      {/* PROBLEM & SOLUTION */}
      <section className="py-12 md:p-16" id="background">
        <div className="container grid gap-8 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-6">
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
          <div className="rounded-xl border bg-card p-6">
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
