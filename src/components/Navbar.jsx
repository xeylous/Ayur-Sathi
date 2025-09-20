"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Menu, X } from "lucide-react";
import Image from "next/image";


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

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* LEFT: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-brand-700 to-brand-600 grid place-items-center text-black">
            <Image
              src="/logo.jpg" // path to your image inside "public" folder
              alt="Logo"
              width={200} // required
              height={200} // required
              className="rounded-lg"
            />
          </div>
          <span className="text-2xl font-semibold tracking-tight text-brand-900">
            Ayurसाथी
          </span>
        </Link>

        {/* MIDDLE: Desktop Nav */}
        <div className="hidden md:flex items-center gap-3 text-lg">
          <NavItem to="/" label="Home" />
          <NavItem to="/explore" label="Explore" />
          {/* <NavItem to="/apis" label="APIs" /> */}
          <NavItem to="/marketplace" label="Marketplace" />
          
        </div>

        {/* RIGHT: Login + Mobile Toggle */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden md:inline-block text-lg font-medium text-black  hover:text-white bg-[#90A955] hover:bg-[#4F772D] focus:ring-4  rounded-2xl 
            px-9 py-1 text-center"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="hidden md:inline-block text-lg font-medium text-black  hover:text-white bg-[#90A955] hover:bg-[#4F772D] focus:ring-4  rounded-2xl 
            px-9 py-1 text-center mr-6"
          >
            Register
          </Link>
          <button
            className="md:hidden p-2 rounded-md text-brand-700 hover:bg-[#ECF39E] hover:text-brand-900"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {open && (
        <nav className="md:hidden flex flex-col gap-1 p-2 border-t bg-white">
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
          {/* <NavItem to="/apis" label="APIs" closeMenu={() => setOpen(false)} /> */}
          {/* <NavItem to="/docs" label="Docs" closeMenu={() => setOpen(false)} /> */}
          <Link
            href="/login"
            className="mt-2 text-lg font-medium text-black bg-[#ECF39E] rounded-lg px-5 py-2.5 text-center"
            onClick={() => setOpen(false)}
          >
            Login
          </Link>
          <Link
            href="/register"
            className="mt-2 text-lg font-medium text-black bg-[#ECF39E] rounded-lg px-5 py-2.5 text-center"
            onClick={() => setOpen(false)}
          >
            Register
          </Link>
        </nav>
      )}
    </header>
  );
}
