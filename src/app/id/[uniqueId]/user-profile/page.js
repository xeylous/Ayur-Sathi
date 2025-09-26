"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { useAuth } from "@/context/AuthContext";


export default function Page() {
 
  

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f8cc]/50">
      {/* Navbar */}
      <Navbar />

      
     <h1>
        user profile page
     </h1>
      {/* Footer sticks at bottom */}
      <Footer />
    </div>
  );
}
