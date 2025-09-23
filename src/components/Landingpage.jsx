"use client";

import React, { Suspense } from "react";
import Home_1 from "@/components/Home_1";
import Home_2 from "@/components/Home_2";
import Index from "@/components/Index"; 
import LandingSkeleton from "@/components/LandingSkeleton";
import Home_d from "@/components/Home_d";
import { N } from "ethers";


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
