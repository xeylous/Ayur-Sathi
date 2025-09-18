"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const sections = [
  { id: "citizens", title: "For Citizens", content: <p>Citizens component content here</p> },
  { id: "organizations", title: "For Organizations", content: <p>Organizations component content here</p> },
  { id: "case-study", title: "Case Study", content: <p>Case Study content here</p> },
  { id: "tech", title: "Technology Overview", content: <p>Technology Overview content here</p> },
  { id: "org-model", title: "Organizational Model", content: <p>Organizational Model content here</p> },
  { id: "impl-model", title: "Implementation Model", content: <p>Implementation Model content here</p> },
  { id: "arch", title: "Architecture", content: <p>Architecture content here</p> },
  { id: "security", title: "DigiLocker Security Architecture", content: <p>Security Architecture content here</p> },
  { id: "roadmap", title: "DigiLocker Development Roadmap", content: <p>Development Roadmap content here</p> },
  { id: "exchange", title: "Data Exchange", content: <p>Data Exchange content here</p> },
];

export default function SidebarLayout() {
  const [active, setActive] = useState(sections[0].id);
  const [open, setOpen] = useState(null);

  return (
    <div className="min-h-screen bg-[#ECF39E]/30 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-1/4  border-r border-green-700 p-5">
        {sections.map((section) => (
          <div key={section.id} className="mb-2">
            <button
              onClick={() => {
                setActive(section.id);
                setOpen(open === section.id ? null : section.id);
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

            {/* Show dropdown content in small/medium screens */}
            <div
              className={`md:hidden mt-2 px-3 py-2 bg-white rounded ${
                open === section.id ? "block" : "hidden"
              }`}
            >
              {section.content}
            </div>
          </div>
        ))}
      </aside>

      {/* Content Area (for large screens) */}
      <main className="hidden lg:block flex-1 p-6">
        {sections.find((section) => section.id === active)?.content}
      </main>
    </div>
  );
}
