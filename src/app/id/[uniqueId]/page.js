"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Profile from "@/components/AfterLogin/Profile";
import { useAuth } from "@/context/AuthContext";
import Landingpage from "@/components/Landingpage";

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { uniqueId } = useParams();

  useEffect(() => {
    // Once loading is done, check if user exists
    if (!loading && !user) {
      router.push("/login"); // redirect to home if unauthorized
    }
  }, [user, loading, router]);

  // While checking auth or if user not yet loaded, show nothing
  if (loading || !user) {
    return <p className="text-center mt-10">Checking authorization...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f8cc]/50">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-grow items-start bg-[#f5f8cc]/50 py-6">
        {/* <Profile uniqueId={uniqueId} /> */}
        <Landingpage />
      </main>

      {/* Footer sticks at bottom */}
      <Footer />
    </div>
  );
}
