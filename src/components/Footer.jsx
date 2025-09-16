import React from "react";
import { Mail, Phone, Instagram, Twitter, Facebook, Github } from "lucide-react";

// Footer component for Ayur Saathi app. Filename: fooer.jsx
// Tailwind CSS utility classes used. Export default a React component.

export default function Fooer() {
  const year = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Consultation", href: "/consultation" },
    { label: "Herb Library", href: "/herbs" },
    { label: "Blog", href: "/blog" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer className="bg-[#31572C] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand / About */}
          <div className="space-y-4">
            <h3 className="text-2xl font-extrabold">Ayur Saathi</h3>
            <p className="text-sm leading-relaxed max-w-xs text-[#ECF39E]">
              Holistic, evidence-informed Ayurvedic guidance for everyday wellness — herbs,
              routines, and trusted practitioners in one place.
            </p>
            <div className="flex items-center space-x-3 mt-2">
              <a
                aria-label="Instagram"
                href="https://instagram.com"
                className="p-2 rounded-md hover:bg-[#4F772D]"
              >
                <Instagram size={18} />
              </a>
              <a
                aria-label="Twitter"
                href="https://twitter.com"
                className="p-2 rounded-md hover:bg-[#4F772D]"
              >
                <Twitter size={18} />
              </a>
              <a
                aria-label="Facebook"
                href="https://facebook.com"
                className="p-2 rounded-md hover:bg-[#4F772D]"
              >
                <Facebook size={18} />
              </a>
              <a
                aria-label="Github"
                href="https://github.com"
                className="p-2 rounded-md hover:bg-[#4F772D]"
              >
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="hover:underline focus:outline-none focus:ring-2 focus:ring-[#90A955] rounded"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide">Contact</h4>
            <div className="mt-4 text-sm space-y-3">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <a href="tel:+911234567890" className="hover:underline">
                  +91 12345 67890
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:hello@ayursaathi.app" className="hover:underline">
                  hello@ayursaathi.app
                </a>
              </div>

              <p className="text-xs text-[#ECF39E]">
                For urgent consultations, please contact support. We commit to responding within 48
                hours.
              </p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide">Stay in the loop</h4>
            <p className="mt-3 text-sm max-w-sm text-[#ECF39E]">Get herbal tips, seasonal routines, and updates.</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const email = fd.get("email");
                alert(`Thanks! We'll send updates to: ${email}`);
                e.currentTarget.reset();
              }}
              className="mt-4"
            >
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="flex gap-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@domain.com"
                  className="flex-1 px-3 py-2 rounded-md border border-[#90A955] bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#90A955]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[#90A955] text-white font-medium hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-[#90A955]"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-10 border-t border-[#4F772D] pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm">
            © {year} Ayur Saathi — All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <nav aria-label="footer-legal">
              <ul className="flex gap-4 text-sm">
                {legalLinks.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="hover:underline">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="text-sm text-[#ECF39E]">Made with ❤️ for wellbeing</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
