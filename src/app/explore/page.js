'use client';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import ThemeBanner from "@/components/ExploreComp/ThemeBanner";
import SidebarLayout from "@/components/ExploreComp/SidebarLayout";
import { Suspense } from "react";
import LandingSkeleton from "@/components/LandingSkeleton";


export default function Home() {
  return (
    <>
    
    <Navbar />
    <Suspense fallback={<LandingSkeleton />}>
          <div>
            <ThemeBanner />
            <SidebarLayout />
          </div>
        </Suspense>
    
    
    {/* <Explore /> */}
    <Footer />
    </>
  );
}
