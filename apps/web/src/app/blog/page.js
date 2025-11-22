'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cropinfo from "@/components/cropinfo";
import BlogPage from "@/components/Blog";


export default function Home() {
  return (
    <>
      {/* Navbar is fixed at top */}
      <Navbar />

      {/* Page content */}
      <div>
        {/* ThemeBanner directly under navbar */}
        {/* <ThemeBanner /> */}
        <BlogPage />

        {/* Sidebar + Content, with top padding to avoid navbar overlap */}
        <div > 
          
        </div>
      </div>

      <Footer />
    </>
  );
}
