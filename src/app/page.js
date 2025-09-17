"use client";
import Navbar from "@/components/Narbar";
import Footer from "@/components/Footer";
import Home_1 from "@/components/Home_1";
import Home_2 from "@/components/Home_2";
import Home_d from "@/components/Home_d";

import Image from "next/image";
import { use } from "react";
// import Navbar from "../components/Navbar";
export default function Home() {
  return (
  <>
  
  {/* <Navbar /> */}
  <Navbar />
  <Home_1/>
  
  <Home_2/>
  <Home_d/>

  <Footer/>
  
  </>
  );
}
