"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

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
  const router = useRouter();
  const { user, setUser, loading } = useAuth();

  // Close menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Logout handler
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST", credentials: "include" });
      if (res.ok) {
        setUser(null);
        router.push("/login");
      }
    } catch (err) {
      console.error(err);
    }
  };
    if (loading) {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="flex justify-center items-center h-16">
        <span>Loading...</span>
      </div>
    </header>
  );
}


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
          {!loading ? (
            user ? (
              // Logged in
              <div className="flex items-center gap-4">
                <Link
                  href={`/id/${user.uniqueId}/profile`}
                  className="flex items-center gap-2 text-sm font-medium text-brand-700 hover:text-brand-900"
                >
                  <Image
                    src="/logo.jpg"
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full border"
                  />
                  {user.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-black hover:text-white bg-[#90A955] hover:bg-[#4F772D] rounded-2xl px-4 py-1"
                >
                  Logout
                </button>
              </div>
            ) : (
              // Not logged in
              <>
                <Link
                  href="/login"
                  className="hidden md:inline-block text-lg font-medium text-black hover:text-white bg-[#90A955] hover:bg-[#4F772D] rounded-2xl px-9 py-1 text-center"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="hidden md:inline-block text-lg font-medium text-black hover:text-white bg-[#90A955] hover:bg-[#4F772D] rounded-2xl px-9 py-1 text-center mr-6"
                >
                  Register
                </Link>
              </>
            )
          ) : (
            <span>Checking auth...</span>
          )}
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setOpen(false)}
            />

            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 right-0 w-72 bg-white shadow-lg z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b">
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

              <div className="flex flex-col p-4 gap-3">
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

                {!loading && user ? (
                  <>
                    <Link
                      href={`/id/${user.uniqueId}/profile`}
                      className="mt-4 text-lg font-medium text-black bg-[#ECF39E] rounded-lg px-5 py-2.5 text-center"
                      onClick={() => setOpen(false)}
                    >
                      {user.name} (Profile)
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="mt-2 text-lg font-medium text-black bg-[#ECF39E] rounded-lg px-5 py-2.5 text-center"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="mt-4 text-lg font-medium text-black bg-[#ECF39E] rounded-lg px-5 py-2.5 text-center"
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
                  </>
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
