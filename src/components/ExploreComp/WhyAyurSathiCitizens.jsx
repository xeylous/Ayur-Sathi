"use client";
import { ShieldCheck, Leaf, IndianRupee, QrCode } from "lucide-react";

export default function WhyAyurSathiCitizens() {
  const points = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-green-600" />,
      title: "Authentic & Safe",
      desc: "Every herb is verified with blockchain-backed provenance and lab certification.",
    },
    {
      icon: <Leaf className="w-8 h-8 text-green-600" />,
      title: "Traceable Origins",
      desc: "Scan QR codes to view farm location, collection date, and processing timeline.",
    },
    {
      icon: <IndianRupee className="w-8 h-8 text-green-600" />,
      title: "Fair Pricing",
      desc: "Purchase herbs directly from farmers at government-set rates without middlemen.",
    },
    {
      icon: <QrCode className="w-8 h-8 text-green-600" />,
      title: "Easy Access",
      desc: "Responsive web portal ensures citizens can browse and order herbs anytime, anywhere.",
    },
  ];

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
          Why Ayur Sathi? <span className="text-green-600">For Citizens</span>
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center p-6 bg-white shadow-md rounded-2xl hover:shadow-lg transition"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-center text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
