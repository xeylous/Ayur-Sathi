"use client";

import { useRouter } from "next/navigation";
import { UserPlus, Building2, Smartphone } from "lucide-react";

export default function Home_d() {
  const router = useRouter();

  const handleFarmerRegister = () => {
    router.push("/register");
  };

  const handleLabRegister = () => {
    router.push("/register");
  };

  return (
    <main className="hidden bg-[#ECF39E]/30 md:flex items-center justify-center p-6 py-12">
      <section className="bg-white max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-8 rounded-2xl border-2 border-[#90A955]/30 shadow-lg px-8 py-10">
        {/* Left card: Become a Partner */}
        <div className="bg-gradient-to-br from-[#90A955] to-[#4F772D] rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-6 w-full md:w-1/2">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
              Join the Ayur-Sathi
              <br />
              Network
            </h2>
            <p className="mt-3 text-sm md:text-base text-white/90 max-w-md mx-auto md:mx-0">
              Register as a Farmer, Laboratory, or Manufacturing Partner to participate in transparent herbal supply chain tracking.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleFarmerRegister}
                className="inline-flex items-center justify-center gap-2 bg-white text-[#31572C] text-sm font-semibold px-5 py-3 rounded-md shadow-sm hover:shadow-lg transition hover:bg-gray-50"
                aria-label="Register as Farmer"
              >
                <UserPlus size={18} />
                Register as Farmer
              </button>
              <button
                onClick={handleLabRegister}
                className="inline-flex items-center justify-center gap-2 bg-[#31572C] text-white text-sm font-semibold px-5 py-3 rounded-md shadow-sm hover:shadow-lg transition hover:bg-[#4F772D]"
                aria-label="Register as Lab/Partner"
              >
                <Building2 size={18} />
                Partner with Us
              </button>
            </div>
          </div>

          <div className="w-28 h-28 md:w-36 md:h-36 flex items-center justify-center">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg
                width="72"
                height="72"
                viewBox="0 0 88 88"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle cx="44" cy="44" r="44" fill="#ECF39E" />
                <g transform="translate(20,20)">
                  {/* Leaf icon */}
                  <path
                    d="M24 0C13 0 4 9 4 20C4 31 13 40 24 40C35 40 44 31 44 20C44 9 35 0 24 0Z"
                    fill="#31572C"
                    opacity="0.8"
                  />
                  <path
                    d="M24 8C18 8 13 13 13 19C13 25 18 30 24 30C30 30 35 25 35 19C35 13 30 8 24 8Z"
                    fill="#90A955"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Right area: Mobile App Download */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 w-full md:w-1/2">
          {/* QR code with download options */}
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-xl md:text-2xl font-bold text-[#31572C] text-center">
              Download Ayur-Sathi App
            </h3>
            <p className="text-sm text-gray-600 text-center max-w-sm">
              Track your batches, manage crops, and access lab reports on the go.
            </p>

            {/* QR Code */}
            <img
              src="/frame.png"
              alt="QR Code to download Ayur-Sathi App"
              className="w-32 h-32 md:w-40 md:h-40 object-contain border-2 border-[#90A955] rounded-lg p-2 bg-white"
            />

            {/* Download Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Google Play link coming soon!");
                }}
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[#31572C] rounded-lg text-sm font-medium shadow-sm bg-white text-[#31572C] hover:bg-[#31572C] hover:text-white transition"
                aria-label="Get it on Google Play"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <span>Google Play</span>
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("App Store link coming soon!");
                }}
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[#31572C] rounded-lg text-sm font-medium shadow-sm bg-[#31572C] text-white hover:bg-[#4F772D] transition"
                aria-label="Download on the App Store"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                </svg>
                <span>App Store</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
