import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { FarmerProvider } from "@/context/FarmerContext";
import { CropProvider } from "@/context/CropContext"; 
import { Analytics } from '@vercel/analytics/next';
import SocketInitializer from "./SocketInitializer";
import ChatbotAssistant from "@/components/ChatbotAssistant";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ayur Sathi — Transparent Ayurvedic Herb Traceability Platform",
  description: "AyurSaathi provides blockchain-powered traceability for Ayurvedic herbs — from geo-tagged harvests to lab-certified quality testing, processing, and QR-verified consumer provenance. Built for farmers, labs, and manufacturers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <SocketInitializer /> */}
        <AuthProvider >
          <FarmerProvider>
            <CropProvider>

            
        {children}
        <Analytics />
        </CropProvider>
        </FarmerProvider>
        <ChatbotAssistant />
        </AuthProvider>
      </body>
    </html>
  );
}
