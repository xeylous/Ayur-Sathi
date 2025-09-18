'use client';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import ThemeBanner from "@/components/ExploreComp/ThemeBanner";
import SidebarLayout from "@/components/ExploreComp/SidebarLayout";

export default function Home() {
  return (
    <>
    <Navbar />
    <ThemeBanner />
    <SidebarLayout />
    {/* <Explore /> */}
    <Footer />
    </>
  );
}
