import React from "react";
import { MapPin, Factory, FlaskConical, QrCode, ShieldCheck, Network, BarChart, Smartphone, Boxes } from "lucide-react";

export default function Home_1() {
  const items = [
    { icon: <MapPin size={22} />, title: "CollectionEvent", desc: "GPS, species, moisture" },
    { icon: <Factory size={22} />, title: "ProcessingStep", desc: "Drying, grinding" },
    { icon: <FlaskConical size={22} />, title: "QualityTest", desc: "Lab certificates" },
    { icon: <QrCode size={22} />, title: "Smart Label", desc: "On-chain QR codes" },
    { icon: <ShieldCheck size={22} />, title: "Compliance", desc: "Rules auto-validated" },
    { icon: <Network size={22} />, title: "Permissioned network", desc: "Node roles for farmers, labs, processors, manufacturers." },
    { icon: <QrCode size={22} />, title: "Smart labeling", desc: "Unique QR per batch; consumer web portal for provenance." },
    { icon: <Boxes size={22} />, title: "Interoperable bundles", desc: "FHIR-style resources: CollectionEvent, QualityTest, ProcessingStep, Provenance." },
    { icon: <BarChart size={22} />, title: "Dashboards & reports", desc: "Harvest volumes, QA results, sustainability metrics." },
    { icon: <Smartphone size={22} />, title: "Offline-first capture", desc: "Low-bandwidth DApp; SMS-over-blockchain gateway." },
    { icon: <Factory size={22} />, title: "ERP connectors", desc: "REST APIs + plugins for QMS/ERP systems." },
  ];

  return (
    <section className="bg-[#ECF39E]/30 py-16 pb-32 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#31572C] mb-10">How it works</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-white rounded-xl border border-[#90A955] shadow-sm p-5 hover:shadow-md transition"
            >
              <div className="p-2 bg-[#4F772D] text-white rounded-md">
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold text-[#31572C]">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
