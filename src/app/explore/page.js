'use client';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeBanner from "@/components/ExploreComp/ThemeBanner";
import SidebarLayout from "@/components/ExploreComp/SidebarLayout";
import { Suspense } from "react";
import LandingSkeleton from "@/components/LandingSkeleton";

export default function Home() {
  return (
    <>
      {/* Navbar is fixed at top */}
      <Navbar />

      {/* Page content */}
      <div>
        {/* ThemeBanner directly under navbar */}
        <ThemeBanner />

        {/* Sidebar + Content, with top padding to avoid navbar overlap */}
        <div > 
          <Suspense fallback={<LandingSkeleton />}>
            <SidebarLayout />
          </Suspense>
        </div>
      </div>

      <Footer />
    </>
  );
}
