"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// import Home_1 from "@/components/Home_1";
// import Home_2 from "@/components/Home_2";



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
