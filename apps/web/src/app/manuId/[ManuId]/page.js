"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ManufactureDashboard from "@/components/ManufactureDashboard/page";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8fae3]/50">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-grow items-start bg-[#f8fae3]/50 py-6">
       <ManufactureDashboard />
      </main>

      {/* Footer sticks at bottom */}
      <Footer />
    </div>
  ); 
}
