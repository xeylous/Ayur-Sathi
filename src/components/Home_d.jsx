import React from "react";

// Home_d.jsx
// TailwindCSS-based React component that reproduces the provided design.

export default function Home_d() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-8">
      <section className="bg-[#ECF39E]/30 max-w-6xl w-full flex items-center justify-between gap-8">
        {/* Left card: Become a DigiLocker Partner Organization */}
        <div className="bg-green-500 rounded-xl shadow-lg p-8 flex items-center gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-extrabold text-[#08286B] leading-tight">
              Become a DigiLocker
              <br />
              Partner Organization
            </h2>
            <p className="mt-3 text-sm text-gray-800 max-w-md">
              Get registered as a DigiLocker Issuer or Requester!
            </p>

            <button
              className="mt-6 inline-block bg-white text-sm font-semibold px-5 py-3 rounded-md shadow-sm hover:shadow-lg transition"
              aria-label="Get registered"
            >
              GET REGISTERED
            </button>
          </div>

          <div className="w-36 h-36 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-white/40 to-white/25 flex items-center justify-center">
              <svg width="88" height="88" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
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

        {/* Right area: show QR, download buttons, and Phone */}
        <div className="flex items-start gap-12">
          {/* QR code with download options */}
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-800">Download Ayur Saathi App</h3>
            <img
              src="/frame.png"
              alt="QR Code"
              className="w-36 h-36 object-contain"
            />
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm shadow-sm bg-green-500"
                aria-label="Get it on Google Play"
              >
                <span>Google Play</span>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm shadow-sm bg-green-500"
                aria-label="Download on the App Store"
              >
                <span>App Store</span>
              </a>
            </div>
          </div>

          {/* Phone mockup as free image */}
          <img
            src="/ayursaathi.png"
            alt="Phone"
            className="w-50 h-82 object-contain rounded-2xl "
          />
        </div>
      </section>

      {/* floating accessibility button */}
      <button
        className="fixed right-6 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
        aria-label="Accessibility options"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2a4 4 0 100 8 4 4 0 000-8zM6 20v-2a6 6 0 0112 0v2H6z" fill="white" />
        </svg>
      </button>
    </main>
  );
}