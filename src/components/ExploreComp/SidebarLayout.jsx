"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import WhyAyurSathiCitizens from "./WhyAyurSathiCitizens";
import WhyAyurSathiOrganizations from "./WhyAyurSathiOrganizations";
import AyurHerbTraceCaseStudy from "./AyurHerbTraceCaseStudy";
import AyurSaathiEcosystem from "./AyurSaathiTechnology";
import AyurSaathiOrganizationalModel from "./AyurSaathiOrganizationalModel";
import ApplyForLabs from "./ApplyForLabs";

const sections = [
  {
    id: "why",
    title: "Why Ayur Saathi?",
    children: [
      {
        id: "citizens",
        title: "For Citizens",
        component: <WhyAyurSathiCitizens />,
      },
      {
        id: "organizations",
        title: "For Organizations",
        component: <WhyAyurSathiOrganizations />,
      },
    ],
  },
  {
    id: "case-study",
    title: "Case Study",
    component: <AyurHerbTraceCaseStudy />,
  },
  {
    id: "tech",
    title: "Technology Overview",
    component: <AyurSaathiEcosystem />,
  },
  {
    id: "org-model",
    title: "Organizational Model",
    component: <AyurSaathiOrganizationalModel />,
  },
  {
    id: "impl-model",
    title: "Implementation Model",
    component: <WhyAyurSathiCitizens />,
  },
  { id: "arch", title: "Architecture", component: <WhyAyurSathiCitizens /> },
  {
    id: "security",
    title: "DigiLocker Security Architecture",
    component: <WhyAyurSathiCitizens />,
  },
  {
    id: "roadmap",
    title: "Apply for Partnership",
    component: <WhyAyurSathiCitizens />,
  },
  {
    id: "exchange",
    title: "Lab Partnership",
    component: <ApplyForLabs />,
  },
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
      className={`w-full flex justify-between items-center px-3 py-2 rounded-xl transition cursor-pointer ${
        active === section.id
          ? "bg-[#90A955] text-white"
          : "bg-white text-gray-800 hover:bg-[#90A955]/20"
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

  const activeComponent = sections
    .flatMap((s) => (s.children ? s.children : s))
    .find((s) => s.id === active)?.component;

  return (
    <div className="min-h-screen bg-[#ECF39E]/30 flex relative ">
      {/* -------- Desktop View -------- */}
      <div className="hidden lg:flex min-h-screen bg-[#ECF39E]/30 relative w-full">
        {/* Sidebar */}
        <aside className="lg:w-1/4 py-2 px-6">
          <div className="sticky top-20 self-start max-h-[80vh] overflow-y-auto">
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
                        className={`w-full text-left px-3 py-3 gap-2 rounded-lg block transition cursor-pointer ${
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

        {/* Desktop Right Content */}
        <main className="flex-1 p-6 overflow-y-auto">{activeComponent}</main>
      </div>

      {/* -------- Mobile View -------- */}
      <div className="lg:hidden w-full px-4 pt-4">
        <div className="space-y-2">
          {sections.map((section) => (
            <div key={section.id} className="border rounded-lg overflow-hidden">
              {/* Parent button */}
              <button
                onClick={() => {
                  if (section.children) {
                    setOpen(open === section.id ? null : section.id);
                  } else {
                    setActive(section.id);
                    setOpen(section.id);
                  }
                }}
                className={`w-full flex justify-between items-center px-4 py-3 text-sm md:text-base font-medium transition cursor-pointer
                  ${
                    active === section.id
                      ? "bg-[#90A955] text-white"
                      : "bg-white text-gray-800 hover:bg-[#90A955]/20"
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

              {/* Child buttons */}
              {section.children && open === section.id && (
                <div className="bg-gray-50">
                  {section.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => setActive(child.id)}
                      className={`block w-full text-left px-6 py-3 text-sm transition cursor-pointer
                        ${
                          active === child.id
                            ? "bg-[#4F772D] text-white"
                            : "text-gray-700 hover:bg-[#90A955]/20"
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

        {/* Active Component (bottom only in mobile) */}
        <div className="w-full mt-6">{activeComponent}</div>
      </div>
    </div>
  );
}
