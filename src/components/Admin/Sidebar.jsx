"use client";
import { LayoutDashboard, Users, DollarSign, FlaskConical } from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab }) => (
  <aside className="w-64 bg-indigo-900 text-white p-6 shadow-2xl h-full fixed top-0 left-0">
    <div className="text-2xl font-bold mb-8 text-teal-300 flex items-center gap-2">
      <LayoutDashboard size={24} /> AyurSaathi Admin
    </div>
    <nav className="space-y-3">
      {[
        { id: "dashboard", icon: LayoutDashboard, label: "Overview" },
        { id: "user", icon: Users, label: "Lab Approvals" },
        { id: "farmerPayment", icon: DollarSign, label: "Farmer Payments" },
        { id: "laboratory", icon: FlaskConical, label: "Marketplace Listing" },
        {id: "manufacturer", icon: FlaskConical, label: "Manufacturer Approvals"}
      ].map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
            activeTab === id
              ? "bg-indigo-700 font-semibold border-l-4 border-amber-300"
              : "hover:bg-indigo-800"
          }`}
        >
          <Icon size={20} className="mr-3" />
          {label}
        </button>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
