"use client";
import Navbar from '@/components/Navbar';
import RegisterPage from '@/components/RegisterPage';
import Footer from '@/components/Footer';
import React from 'react'


const page = () => {
  return (
    <div>
       <Navbar />
         <RegisterPage />
          <Footer />

    </div>
  )
}

export default page
