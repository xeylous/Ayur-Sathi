"use client";
import RegisterPage from '@/components/RegisterPage';
import Footer from '@/components/Footer';
import React from 'react';
import OTPPage from '@/components/Otp/OTPInput';
import Navbar_otp from '@/components/Otp/Navbar_otp';

const page = () => {
  return (
    <div className="flex flex-col min-h-screen  bg-[#f5f8cc]/50">
      <Navbar_otp />
      {/* Main content (pushes footer down) */}
      
      <main className="flex-grow items-start  bg-[#f5f8cc]/50 py-6">
        <OTPPage />
      </main>

      {/* Footer sticks at bottom */}
      <Footer />
    </div>
  );
};

export default page;
