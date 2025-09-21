import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatbotAssistant from "@/components/ChatbotAssistant";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"], 
});

export const metadata = {
  title: "Ayur Sathi",
  description: "A platform to know details of the Ayurvedic Herbs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ChatbotAssistant />
        <ToastContainer
          position="top-right"
          hideProgressBar={true}
          closeOnClick={false}
          pauseOnHover={true}
          draggable={false}
          marginTop="100px"
          autoClose={3000}
        />
      </body>
    </html>
  );
}
