"use client";


import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";



export default function Page() {
 

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f8cc]/50">
      {/* Navbar */}
      <Navbar />

      <h1>
        farmer profile page
     </h1>
     
      {/* Footer sticks at bottom */}
      <Footer />
    </div>
  );
}
