"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import FarmerDashboard from "@/components/FarmerDashboard/FarmerDashboard";
import UserDashboard from "@/components/UserDashboard/UserDashboard";

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
      <div className="flex justify-center items-center min-h-screen bg-[#f5f8cc]/50">
        <p className="text-lg font-medium text-gray-600">
          Verifying session...
        </p>
      </div>
    );
  }

  if (!user) return null; // while redirecting

  console.log("user in [uniqueId]:", user);

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f8cc]/50">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-grow items-start bg-[#f5f8cc]/50 py-6">
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
