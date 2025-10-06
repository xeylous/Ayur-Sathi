"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import FarmerDashboard from "@/components/FarmerDashboard/FarmerDashboard";
import UserDashboard from "@/components/UserDashboard/UserDashboard";
import LandingSkeleton from "@/components/LandingSkeleton";

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { uniqueId } = useParams();

  // Redirect if not logged in (only runs after verification)
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  // 🚨 Block rendering until verify-token finishes
  if (loading) {
    return (
      <div >
        
         <LandingSkeleton />
        
      </div>
    );
  }

  if (!user) return null; // while redirecting

  // console.log("user in [uniqueId]:", user);

  return (
    <div className="flex flex-col min-h-screen bg-[#ECF39E]  ">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-grow items-start  ">
        {user.type === "farmer" ? (
          <FarmerDashboard />
        ) : (
          <UserDashboard />
        )}
      </main>

      {/* Footer sticks at bottom */}
      <Footer />
    </div>
  );
}
