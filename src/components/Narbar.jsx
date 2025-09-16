"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Menu, X } from "lucide-react";

// Reusable nav item
const NavItem = ({ to, label, closeMenu, className }) => {
  const pathname = usePathname();
  const isActive = pathname === to;

  return (
    <Link
      href={to}
      onClick={closeMenu}
      className={[
        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive
          ? "bg-[#ECF39E] text-brand-900"
          : "text-brand-700 hover:bg-[#ECF39E] hover:text-brand-900",
        className, // allow custom classes if passed
      ].join(" ")}
    >
      {label}
    </Link>
  );
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu whenever route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur bg-white md:px-20 lg:px-32 ">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 ">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-brand-700 to-brand-600 grid place-items-center text-black">
            <Leaf className="h-8 w-6" />
          </div>
          <span className="text-2xl font-semibold tracking-tight text-brand-900">
            Ayurसाथी
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-xl">
          <NavItem to="/" label="Home" />
          <NavItem to="/explore" label="Explore" />
          <NavItem to="/dashboard" label="Dashboard" />
          <NavItem to="/apis" label="APIs" />
          <NavItem to="/docs" label="Docs" />
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-md text-brand-700 hover:bg-[#ECF39E] hover:text-brand-900 ml-auto"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="md:hidden flex flex-col gap-1 p-2 border-t bg-background">
          <NavItem to="/" label="Home" closeMenu={() => setOpen(false)} />
          <NavItem to="/explore" label="Explore" closeMenu={() => setOpen(false)} />
          <NavItem to="/dashboard" label="Dashboard" closeMenu={() => setOpen(false)} />
          <NavItem to="/apis" label="APIs" closeMenu={() => setOpen(false)} />
          <NavItem to="/docs" label="Docs" closeMenu={() => setOpen(false)} />
        </nav>
      )}
    </header>
  );
}
