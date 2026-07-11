"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ManufactureDashboard from "@/components/ManufactureDashboard/page";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-[#ECF39E]">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1">
       <ManufactureDashboard />
      </main>

      {/* Footer sticks at bottom */}
      <Footer />
    </div>
  ); 
}
