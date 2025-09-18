"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import WhyAyurSathiCitizens from "./WhyAyurSathiCitizens";

// Import your actual components

// Define structure with nesting
const sections = [
  {
    id: "why",
    title: "Why Ayur Saathi?",
    children: [
      { id: "citizens", title: "For Citizens", component: <WhyAyurSathiCitizens /> },
      { id: "organizations", title: "For Organizations", component: <WhyAyurSathiCitizens /> },
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
  const [active, setActive] = useState(null);
  const [open, setOpen] = useState(null);

  const renderButton = (section) => (
    <button
      onClick={() => {
        if (section.children) {
          // toggle parent accordion
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
      <ChevronDown
        className={`w-4 h-4 transition-transform ${
          open === section.id ? "rotate-180" : "rotate-0"
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-[#ECF39E]/30 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-1/4 border-r border-green-700 p-5">
        {sections.map((section) => (
          <div key={section.id} className="mb-2">
            {renderButton(section)}

            {/* Nested children (only for Why AyurSaathi) */}
            {section.children && (
              <div className={`ml-4 mt-2 ${open === section.id ? "block" : "hidden"}`}>
                {section.children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => setActive(child.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg block transition ${
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

            {/* Small screen content */}
            <div
              className={`md:hidden mt-2 px-3 py-2 bg-white rounded ${
                open === section.id ? "block" : "hidden"
              }`}
            >
              {section.children
                ? section.children.find((c) => c.id === active)?.component
                : active === section.id && section.component}
            </div>
          </div>
        ))}
      </aside>

      {/* Large screen content */}
      <main className="hidden lg:block flex-1 p-6">
        {/* If active is child inside Why AyurSaathi */}
        {sections
          .flatMap((s) => (s.children ? s.children : s))
          .find((s) => s.id === active)?.component}
      </main>
    </div>
  );
}
