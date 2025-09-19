"use client";
import Navbar from '@/components/Navbar';
import RegisterPage from '@/components/RegisterPage';
import Footer from '@/components/Footer';
import React from 'react';

const page = () => {
  return (
    <div className="flex flex-col min-h-screen  bg-[#f5f8cc]/50">
      {/* Navbar */}
      <Navbar />

      {/* Main content (pushes footer down) */}
      <main className="flex-grow items-start  bg-[#f5f8cc]/50 py-6">
        <RegisterPage />
      </main>

      {/* Footer sticks at bottom */}
      <Footer />
    </div>
  );
};

export default page;
