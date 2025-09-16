"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { use } from "react";
import Index from "@/components/Index";
// import Navbar from "../components/Navbar";
export default function Home() {
  return (
  <>
  
  {/* <Navbar /> */}
  <Navbar />
  <Index />
  <Footer/>
  </>
  );
}
