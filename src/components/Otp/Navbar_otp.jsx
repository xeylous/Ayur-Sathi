"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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
        className,
      ].join(" ")}
    >
      {label}
    </Link>
  );
};


export default function Navbar() {

  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // close menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-brand-700 to-brand-600 grid place-items-center text-black">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={200}
              height={200}
              className="rounded-lg"
            />
          </div>
          <span className="text-2xl font-semibold tracking-tight text-brand-900">
            Ayurसाथी
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-3 text-lg">
          <NavItem to="/" label="Home" />
          <NavItem to="/explore" label="Explore" />
          <NavItem to="/marketplace" label="Marketplace" />
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-2">

       
          <button
            className="md:hidden p-2 rounded-md text-brand-700 hover:bg-[#ECF39E] hover:text-brand-900"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 right-0 w-72 bg-white shadow-lg z-50 flex flex-col"
            >
              {/* Header with Close Button */}
              <div className="flex items-center justify-between p-4 border-b bg-white">
                <span className="text-lg font-semibold text-brand-900">
                  Menu
                </span>
                <button
                  className="p-2 rounded-md hover:bg-[#ECF39E] text-brand-700"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Nav Links */}
              <div className="flex flex-col p-4 gap-3 bg-white">
                <NavItem to="/" label="Home" closeMenu={() => setOpen(false)} />
                <NavItem
                  to="/explore"
                  label="Explore"
                  closeMenu={() => setOpen(false)}
                />
                <NavItem
                  to="/marketplace"
                  label="Marketplace"
                  closeMenu={() => setOpen(false)}
                />

              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
