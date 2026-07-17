"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddToCart from "@/components/UserDashboard/AddToCart";

export default function CartPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AddToCart />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
