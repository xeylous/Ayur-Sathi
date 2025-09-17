"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


import Image from "next/image";
import { use } from "react";

import Landingpage from "@/components/Landingpage";

// import Navbar from "../components/Navbar";
export default function Home() {
  return (
  <>
  
  {/* <Navbar /> */}
  <Navbar />
  
  <Landingpage/>

  <Footer/>
  
  </>
  );
}
