"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginPage from "@/components/Login";
import Marketplace from "@/components/ExploreComp/marketplace/Marketplace";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8fae3]/50">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-grow items-start bg-[#f8fae3]/50 py-6">
         <Marketplace />
      </main>

      {/* Footer sticks at bottom */}
      <Footer />
    </div>
  );
}
