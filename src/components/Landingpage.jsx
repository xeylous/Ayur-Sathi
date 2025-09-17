"use client";

import React, { Suspense } from "react";
import Home_1 from "@/components/Home_1";
import Home_2 from "@/components/Home_2";
import IndexContent from "@/components/Index"; 
import LandingSkeleton from "@/components/LandingSkeleton";

function Landingpage() {
  return (
    <Suspense fallback={<LandingSkeleton />}>
      <div>
        <IndexContent />
        <Home_1 />
        <Home_2 />
      </div>
    </Suspense>
  );
}

export default Landingpage;
