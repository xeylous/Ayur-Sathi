"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginPage from "@/components/Login";
import NavbarWithProfile from "@/components/AfterLogin/NavbarWithProfile";
import Profile from "@/components/AfterLogin/Profile";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f5f8cc]/50">
      {/* Navbar */}
      <NavbarWithProfile />

      {/* Main content */}
      <main className="flex-grow items-start bg-[#f5f8cc]/50 py-6">
        <Profile />
      </main>

      {/* Footer sticks at bottom */}
      <Footer />
    </div>
  );
}
