"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import Index from "@/components/Index"; 
import LandingSkeleton from "@/components/LandingSkeleton";

// Dynamic imports — Home_2 has heavy modals (QRScanner, APIDocs) and Home_d is below fold + desktop-only
const Home_1 = dynamic(() => import("@/components/Home_1"), { ssr: false });
const Home_2 = dynamic(() => import("@/components/Home_2"), { ssr: false });
const Home_d = dynamic(() => import("@/components/Home_d"), { ssr: false });

function Landingpage() {
  return (
    <Suspense fallback={<LandingSkeleton />}>
      <div>
        <Index />
        <Home_1 />
        <Home_2 />
       
        <Home_d />
      </div>
    </Suspense>
  );
}

export default Landingpage;
