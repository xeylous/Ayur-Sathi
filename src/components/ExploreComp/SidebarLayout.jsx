"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import WhyAyurSathiCitizens from "./WhyAyurSathiCitizens";
import WhyAyurSathiOrganizations from "./WhyAyurSathiOrganizations";

const sections = [
  {
    id: "why",
    title: "Why Ayur Saathi?",
    children: [
      { id: "citizens", title: "For Citizens", component: <WhyAyurSathiCitizens /> },
      { id: "organizations", title: "For Organizations", component: <WhyAyurSathiOrganizations /> },
    ],
  },
  { id: "case-study", title: "Case Study", component: <WhyAyurSathiCitizens /> },
  { id: "tech", title: "Technology Overview", component: <WhyAyurSathiCitizens /> },
  { id: "org-model", title: "Organizational Model", component: <WhyAyurSathiCitizens /> },
  { id: "impl-model", title: "Implementation Model", component: <WhyAyurSathiCitizens /> },
  { id: "arch", title: "Architecture", component: <WhyAyurSathiCitizens /> },
  { id: "security", title: "DigiLocker Security Architecture", component: <WhyAyurSathiCitizens /> },
  { id: "roadmap", title: "DigiLocker Development Roadmap", component: <WhyAyurSathiCitizens /> },
  { id: "exchange", title: "Data Exchange", component: <WhyAyurSathiCitizens /> },
];

export default function SidebarLayout() {
  const [active, setActive] = useState("citizens");
  const [open, setOpen] = useState("why");

  const renderButton = (section) => (
    <button
      onClick={() => {
        if (section.children) {
          setOpen(open === section.id ? null : section.id);
        } else {
          setActive(section.id);
          setOpen(section.id);
        }
      }}
      className={`w-full flex justify-between items-center px-3 py-2 rounded-xl transition ${
        active === section.id ? "bg-[#90A955] text-white" : "bg-white text-gray-800"
      }`}
    >
      {section.title}
      {section.children && (
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            open === section.id ? "rotate-180" : "rotate-0"
          }`}
        />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#ECF39E]/30 flex relative">
      {/* Sidebar */}
      <aside className="hidden lg:block lg:w-1/4 pr-6">
        <div className="sticky top-20 self-start max-h-[80vh] overflow-y-auto">
          {/* top-20 = below navbar (adjust based on Navbar height) */}
          {sections.map((section) => (
            <div key={section.id} className="mb-2">
              {renderButton(section)}

              {section.children && (
                <div
                  className={`ml-4 mt-3 gap-2 ${
                    open === section.id ? "block" : "hidden"
                  }`}
                >
                  {section.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => setActive(child.id)}
                      className={`w-full text-left px-3 py-3 gap-2 rounded-lg block transition ${
                        active === child.id
                          ? "bg-[#4F772D] text-white"
                          : "bg-white text-gray-700 hover:bg-[#90A955]/20"
                      }`}
                    >
                      {child.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Right side content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {sections
          .flatMap((s) => (s.children ? s.children : s))
          .find((s) => s.id === active)?.component}
      </main>
    </div>
  );
}
