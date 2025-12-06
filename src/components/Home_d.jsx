import React from "react";

export default function Home_d() {
  return (
    <main className="hidden min-h-screen bg-[#ECF39E]/30 md:flex items-center justify-center p-3 mt-0 pt-0  ">
      <section className="bg-white max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl border-2 px-5 py-6">
        {/* Left card: Become a DigiLocker Partner Organization */}
        <div className="bg-green-500 rounded-xl shadow-lg p-5 py-8 flex flex-col md:flex-row items-center gap-6 w-full md:w-1/2">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#08286B] leading-tight">
              Become a DigiLocker
              <br />
              Partner Organization
            </h2>
            <p className="mt-3 text-sm md:text-base text-gray-800 max-w-md mx-auto md:mx-0">
              Get registered as a DigiLocker Issuer or Requester!
            </p>

            <button
              className="mt-6 inline-block bg-white text-sm font-semibold px-5 py-3 rounded-md shadow-sm hover:shadow-lg transition"
              aria-label="Get registered"
            >
              GET REGISTERED
            </button>
          </div>

          <div className="w-28 h-28 md:w-36 md:h-36 flex items-center justify-center">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-white/40 to-white/25 flex items-center justify-center">
              <svg
                width="72"
                height="72"
                viewBox="0 0 88 88"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <circle cx="44" cy="44" r="44" fill="#FCE7D6" />
                <g transform="translate(8,12)">
                  <rect x="20" y="18" width="18" height="26" rx="3" fill="#2F7AEB" />
                  <rect x="4" y="18" width="18" height="26" rx="3" fill="#8338EC" />
                  <circle cx="13" cy="6" r="6" fill="#fff" opacity="0.5" />
                  <circle cx="41" cy="6" r="6" fill="#fff" opacity="0.5" />
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Right area: QR + download + phone */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 w-full md:w-1/2">
          {/* QR code with download options */}
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 text-center">
              Download Ayur Saathi App
            </h3>
            <img
              src="/frame.png"
              alt="QR Code"
              className="w-28 h-28 md:w-36 md:h-36 object-contain"
            />
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="#"
                className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm shadow-sm bg-green-500 text-white"
                aria-label="Get it on Google Play"
              >
                <span>Google Play</span>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm shadow-sm bg-green-500 text-white"
                aria-label="Download on the App Store"
              >
                <span>App Store</span>
              </a>
            </div>
          </div>

          {/* Phone mockup */}
          <img
            src="/ayursaathi.png"
            alt="Phone"
            className="w-40 md:w-56 lg:w-64 h-auto object-contain rounded-2xl pt-4"
          />
        </div>
      </section>

     
    </main>
  );
}
