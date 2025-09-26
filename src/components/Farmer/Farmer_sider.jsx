"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  ShoppingBag,
  Store,
  FileCheck,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function FarmerSidebar() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          open ? "w-64" : "w-20"
        } bg-[#4F772D] h-screen text-white p-4 flex flex-col transition-all duration-300`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="self-end mb-6 text-white"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <img
            src="/logo.jpg"
            alt="Ayur Saath"
            className="w-10 h-10 rounded-lg"
          />
          {open && <h1 className="text-xl font-bold">Ayur Saath</h1>}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4">
          <Link
            href="/farmer/profile"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#90a955] transition"
          >
            <User size={22} />
            {open && <span>Profile</span>}
          </Link>

          <Link
            href="/farmer/orders"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#90a955] transition"
          >
            <ShoppingBag size={22} />
            {open && <span>Orders</span>}
          </Link>

          <Link
            href="/farmer/sell"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#90a955] transition"
          >
            <Store size={22} />
            {open && <span>Sell</span>}
          </Link>

          <Link
            href="/farmer/certificate"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#90a955] transition"
          >
            <FileCheck size={22} />
            {open && <span>Certificate</span>}
          </Link>

          <button
            onClick={() => alert("Logging out...")}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-500 transition mt-auto"
          >
            <LogOut size={22} />
            {open && <span>Logout</span>}
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Welcome, Farmer 👨‍🌾</h1>
        <p className="text-gray-600 mt-2">
          Select an option from the sidebar to continue.
        </p>
      </div>
    </div>
  );
}
