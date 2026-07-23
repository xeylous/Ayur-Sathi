"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ShoppingCart } from "lucide-react";
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
        "px-3 py-2 rounded-md text-base font-medium transition-colors",
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
  const { user, loading, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    try {
      const savedCart = localStorage.getItem("userCart");
      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        const count = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
        setCartCount(count);
      } else {
        setCartCount(0);
      }
    } catch (e) {
      console.error(e);
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();

    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    if (user.type === "lab") return `/labId/${user.labId}`;
    if (user.type === "manu") return `/manuId/${user.manuId}`;
    if (user.type === "admin" || user.type === "store_admin") return "/admin";
    return `/id/${user.uniqueId}`;
  };

  const getProfileLink = () => {
    if (!user) return "/";
    if (user.type === "lab") return `/labId/${user.labId}`;
    if (user.type === "manu") return `/manuId/${user.manuId}`;
    if (user.type === "admin" || user.type === "store_admin") return "/admin";
    return `/id/${user.uniqueId}`;
  };

  const getMobileProfileLink = () => {
    if (!user) return "/";
    if (user.type === "lab") return `/labId/${user.labId}`;
    if (user.type === "manu") return `/manuId/${user.manuId}`;
    if (user.type === "admin" || user.type === "store_admin") return "/admin";
    return `/id/${user.uniqueId}/profile`;
  };

  const getProfileName = () => {
    if (!user) return "";
    if (user.type === "lab") return user.labId;
    if (user.type === "manu") return user.manuId;
    return user.name;
  };
  // console.log("user nav",user);
  if (loading) {
    return (
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="flex justify-center items-center h-16">
          {/* <span>Loading...</span> */}
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-white backdrop-blur">
      <div className="container  mx-auto flex h-16 items-center justify-between px-4 sm:px-6 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-brand-700 to-brand-600 grid place-items-center">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={36}
              height={36}
              className="rounded-lg object-cover"
            />
          </div>
          <span className="text-xl sm:text-2xl font-semibold tracking-tight text-brand-900">
            Ayurसाथी
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-base">
          <NavItem to="/" label="Home" />
          <NavItem to="/explore" label="Explore" />
          <NavItem to="/marketplace" label="Marketplace" />
          {user && (
            <NavItem
              to={getDashboardLink()}
              label="Dashboard"
            />
          )}
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative p-2 text-brand-700 hover:text-[#4F772D] transition-colors mr-1 sm:mr-2"
            title="My Cart"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden sm:flex items-center gap-4">
              <Link
                href={getProfileLink()}
                className="flex items-center gap-2 text-sm font-medium text-brand-700 hover:text-brand-900"
              >
                <Image
                  src="/logo.jpg"
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full border object-cover"
                />
                <span className="hidden sm:inline">
                  {getProfileName()}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="text-base font-semibold text-white bg-[#90A955] hover:bg-[#4F772D] rounded-2xl px-6 py-1.5 text-center shadow-sm transition-all cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex gap-3">
              <Link
                href="/login"
                className="text-base font-semibold text-white bg-[#90A955] hover:bg-[#4F772D] rounded-2xl px-6 py-1.5 text-center shadow-sm transition-all cursor-pointer"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-base font-semibold text-white bg-[#90A955] hover:bg-[#4F772D] rounded-2xl px-6 py-1.5 text-center shadow-sm transition-all cursor-pointer"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-brand-700  hover:bg-[#ECF39E]"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className=" h-6 w-6" />}
          </button>
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
              className="fixed inset-y-0 right-0 w-72 sm:w-80  shadow-lg z-50 flex flex-col"
            >
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
                 {user && (
                  <NavItem
                    to={getDashboardLink()}
                    label="Dashboard"
                  />
                )}

                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-brand-700 hover:bg-[#ECF39E] hover:text-brand-900"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    My Cart
                  </span>
                  {cartCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {user ? (
                  <>
                     <Link
                      href={getMobileProfileLink()}
                      className="mt-4 text-base font-semibold text-white bg-[#90A955] hover:bg-[#4F772D] rounded-xl px-5 py-2.5 text-center shadow-sm transition-all"
                      onClick={() => setOpen(false)}
                    >
                      {getProfileName()} (Profile)
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="mt-2 cursor-pointer text-base font-semibold text-white bg-[#90A955] hover:bg-[#4F772D] rounded-xl px-5 py-2.5 text-center shadow-sm transition-all"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="mt-4 text-base font-semibold text-white bg-[#90A955] hover:bg-[#4F772D] rounded-xl px-5 py-2.5 text-center shadow-sm transition-all"
                      onClick={() => setOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="mt-2 text-base font-semibold text-white bg-[#90A955] hover:bg-[#4F772D] rounded-xl px-5 py-2.5 text-center shadow-sm transition-all"
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
