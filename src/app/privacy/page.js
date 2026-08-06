"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Eye,
  Database,
  Share2,
  UserCheck,
  Cookie,
  Mail,
  ChevronRight,
  ArrowUp,
  Search,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Building2,
  Phone,
  HelpCircle,
  Sparkles,
} from "lucide-react";

/* ───────────────── Metadata & Dates ───────────────── */
const EFFECTIVE_DATE = "August 1, 2026";
const LAST_UPDATED = "August 1, 2026";

/* ───────────────── Privacy Data Sections ───────────────── */
const privacySections = [
  {
    id: "overview",
    icon: ShieldCheck,
    title: "1. Overview & Data Philosophy",
    badge: "DPDPA 2023 Aligned",
    content: [
      `At Ayur Saathi Technologies Pvt. Ltd. ("Ayur Saathi," "we," "us," or "our"), we are deeply committed to protecting your privacy and ensuring the security of your personal, health, and transactional data. As a pioneer in blockchain-powered Ayurvedic herb traceability and wellness services, we adhere to the highest standards of data stewardship and transparency.`,
      `This Privacy Policy explains how we collect, process, store, disclose, and protect your information when you visit our website, mobile application, or use any of our blockchain-verified traceability, consultation, and marketplace services.`,
      `We comply with the Digital Personal Data Protection Act, 2023 (DPDPA), Information Technology Act, 2000, IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and guidelines issued by the Ministry of Ayush, Government of India.`,
    ],
  },
  {
    id: "data-collection",
    icon: Database,
    title: "2. Information We Collect",
    badge: "Minimized Collection",
    content: [
      `We only collect personal information that is necessary to deliver authentic, transparent, and personalized Ayurvedic services. The types of data we collect depend on how you interact with our platform:`,
    ],
    subsections: [
      {
        title: "2.1 Account & Identity Data",
        text: "Full legal name, email address, mobile phone number, physical delivery address, date of birth, and role-specific registration details (e.g., Farmer ID, Lab Accreditation Number, BAMS License Number, or Manufacturer Registration).",
      },
      {
        title: "2.2 Health & Prakriti Data (Optional / Consent-Based)",
        text: "Ayurvedic wellness assessment data (Dosha / Prakriti analysis), lifestyle preferences, dietary habits, health goals, and consultation notes shared voluntarily during practitioner sessions. Health data is classified as sensitive personal data and is processed strictly based on explicit consent.",
      },
      {
        title: "2.3 Geo-Spatial & Traceability Data",
        text: "GPS location coordinates of herb harvests (for registered farmers), batch origin photos, moisture and purity lab metrics, processing logs, and QR code verification scan timestamps.",
      },
      {
        title: "2.4 Payment & Transactional Data",
        text: "Order history, shipping addresses, payment status, and transaction references. Note: Complete credit card, debit card, or UPI credentials are processed directly by PCI-DSS compliant payment gateways and are never stored on Ayur Saathi servers.",
      },
      {
        title: "2.5 Technical & Usage Data",
        text: "IP addresses, browser type, device information, operating system, page views, referral URLs, and session duration captured automatically via cookies and diagnostic logs.",
      },
    ],
  },
  {
    id: "data-usage",
    icon: Eye,
    title: "3. How We Use Your Information",
    badge: "Purpose Specific",
    content: [
      `We process your data strictly for legitimate and lawful purposes directly connected to our platform services:`,
    ],
    list: [
      "Verifying herb provenance and generating immutable supply chain traceability records on the blockchain",
      "Facilitating authentic Ayurvedic doctor consultations and secure record keeping",
      "Processing marketplace orders, payments, fulfillment, and doorstep deliveries",
      "Providing personalized herbal, Prakriti-aligned, and seasonal routine recommendations",
      "Validating lab test certifications submitted by NABL-recognized testing facilities",
      "Sending transactional notifications, QR verification confirmations, and customer support communications",
      "Ensuring platform security, fraud prevention, and regulatory compliance under Indian law",
    ],
  },
  {
    id: "blockchain-privacy",
    icon: Lock,
    title: "4. Blockchain & On-Chain Privacy",
    badge: "Cryptographic Security",
    content: [
      `Ayur Saathi utilizes blockchain technology to ensure absolute transparency and authenticity for Ayurvedic botanicals. We maintain a strict separation between public supply chain data and private personal information:`,
    ],
    subsections: [
      {
        title: "4.1 What Goes On-Chain",
        text: "Only non-personal, supply-chain verification metadata is stored on the immutable ledger. This includes cryptographic batch hashes, harvest geo-coordinates, lab purity certificates, batch manufacturing timestamps, and QR code verification hashes.",
      },
      {
        title: "4.2 What Stays Off-Chain (Private)",
        text: "Your personal identity, full name, phone number, medical history, consultation notes, payment details, and personal delivery address are NEVER written to the public blockchain. They reside in encrypted, off-chain databases protected by enterprise-grade security protocols.",
      },
    ],
  },
  {
    id: "data-sharing",
    icon: Share2,
    title: "5. Data Sharing & Third Parties",
    badge: "No Selling of Data",
    content: [
      `We NEVER sell, rent, or trade your personal data to third-party marketers. Data is shared only with trusted partners strictly necessary for service fulfillment:`,
    ],
    list: [
      "BAMS-Qualified Practitioners: Shared only when you explicitly book a consultation session with a selected doctor",
      "Verified Logistics Partners: Delivery address and contact number provided solely to complete product shipments",
      "PCI-DSS Payment Gateways: Encrypted transaction processing via secure banking partners",
      "NABL-Accredited Laboratories: Analytical batch test reports linked to anonymous herb batch identifiers",
      "Regulatory Authorities & Law Enforcement: Shared only when mandated by court orders, AYUSH compliance directives, or applicable Indian laws",
    ],
  },
  {
    id: "security",
    icon: FileCheck,
    title: "6. Security & Storage Architecture",
    badge: "AES-256 & TLS 1.3",
    content: [
      `We implement state-of-the-art administrative, technical, and physical safeguards to defend your data against unauthorized access, loss, or alteration:`,
    ],
    list: [
      "Data in Transit: Encrypted using Transport Layer Security (TLS 1.3) protocols",
      "Data at Rest: Database entries encrypted using Advanced Encryption Standard (AES-256)",
      "Access Controls: Strict Role-Based Access Controls (RBAC) and Multi-Factor Authentication (MFA) for administrative and lab personnel",
      "Server Infrastructure: Hosted in SOC 2 Type II compliant tier-4 data centers located within India in compliance with data residency laws",
      "Security Audits: Regular third-party penetration testing and vulnerability assessments",
    ],
  },
  {
    id: "user-rights",
    icon: UserCheck,
    title: "7. Your Rights under DPDPA 2023",
    badge: "User Empowerment",
    content: [
      `As a data principal under the Digital Personal Data Protection Act, 2023, you enjoy comprehensive control over your personal data:`,
    ],
    subsections: [
      {
        title: "Right to Access & Summary",
        text: "You can request a summary of personal data being processed along with details of third parties with whom data has been shared.",
      },
      {
        title: "Right to Correction & Erasure",
        text: "You may request correction of inaccurate data or complete deletion of your personal account data (subject to legal retention requirements).",
      },
      {
        title: "Right to Withdraw Consent",
        text: "You can withdraw consent for health data processing or marketing communications at any time through your account settings.",
      },
      {
        title: "Right to Nominate",
        text: "You have the right to nominate an individual who will exercise your data rights in the event of incapacity or death.",
      },
      {
        title: "Grievance Redressal",
        text: "You can register grievances with our Data Protection Officer and escalate to the Data Protection Board of India if unresolved.",
      },
    ],
  },
  {
    id: "cookies",
    icon: Cookie,
    title: "8. Cookies & Tracking Technologies",
    badge: "Granular Control",
    content: [
      `Ayur Saathi uses essential, performance, and analytical cookies to enhance your browsing experience:`,
    ],
    list: [
      "Essential Cookies: Required for session security, authentication state, and shopping cart persistence",
      "Analytical Cookies: Aggregate, anonymized data to measure page performance and site speed",
      "Preference Cookies: Remember your language choices and regional wellness preferences",
    ],
    extra: [
      `You can disable non-essential cookies at any time via your browser settings. Disabling essential cookies may impact authentication and checkout functionalities.`,
    ],
  },
  {
    id: "contact-dpo",
    icon: Mail,
    title: "9. Contact & Grievance Officer",
    badge: "24-Hour Response",
    content: [
      `If you have questions, concerns, or wish to exercise your data rights, please reach out to our dedicated Data Protection Officer (DPO) and Grievance Officer:`,
    ],
    contactInfo: {
      company: "Ayur Saathi Technologies Pvt. Ltd.",
      dpoName: "Data Protection & Grievance Officer",
      email: "dpo@ayursaathi.com",
      support: "ayursaathi@gmail.com",
      phone: "+91 12345 67890",
      address:
        "42, Green Valley Business Park, Sector 62, Noida, Uttar Pradesh 201301, India",
      hours: "Monday – Saturday, 9:00 AM – 6:00 PM IST",
      timelines:
        "We commit to acknowledging data right requests within 24 hours and resolving them within 15 business days as per DPDPA mandates.",
    },
  },
];

/* ───────────────── Component ───────────────── */
export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const containerRef = useRef(null);

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Scroll spy intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    privacySections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Scroll-to-top button visibility
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Filter sections by search query
  const filteredSections = privacySections.filter((section) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const titleMatch = section.title.toLowerCase().includes(query);
    const contentMatch = section.content.some((c) =>
      c.toLowerCase().includes(query)
    );
    const badgeMatch = section.badge?.toLowerCase().includes(query);
    return titleMatch || titleMatch || contentMatch || badgeMatch;
  });

  /* ─── Framer Motion Variants ─── */
  const cardVariant = {
    hidden: { opacity: 0, y: 25 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.04, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <>
      <Navbar />

      {/* Top Animated Scroll Progress Bar */}
      <motion.div
        className="fixed top-16 left-0 right-0 h-[3px] z-50 origin-left"
        style={{
          scaleX,
          background:
            "linear-gradient(90deg, #90A955, #4F772D, #31572C)",
        }}
      />

      {/* Hero Banner Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#31572C] via-[#4F772D] to-[#31572C]">
        {/* Subtle Decorative Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, #ECF39E 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        {/* Decorative Floating Circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#ECF39E]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#90A955]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-6"
          >
            <ShieldCheck className="w-4 h-4 text-[#ECF39E]" />
            <span className="text-sm font-semibold text-[#ECF39E]">
              Data Privacy & Security Standard
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight"
          >
            Privacy Policy
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-5 text-lg md:text-xl text-[#ECF39E]/90 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Your trust is our cornerstone. Learn how Ayur Saathi safeguards your
            personal data, health insights, and blockchain verification records.
          </motion.p>

          {/* Quick Info Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm text-white/90"
          >
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur px-3 py-1.5 rounded-full">
              <FileCheck className="w-4 h-4 text-[#ECF39E]" /> Effective: {EFFECTIVE_DATE}
            </span>
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur px-3 py-1.5 rounded-full">
              <Sparkles className="w-4 h-4 text-[#ECF39E]" /> Last Updated: {LAST_UPDATED}
            </span>
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur px-3 py-1.5 rounded-full">
              <Lock className="w-4 h-4 text-[#ECF39E]" /> DPDPA 2023 Compliant
            </span>
          </motion.div>

          {/* Interactive Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-10 max-w-xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search privacy topics (e.g. blockchain, cookies, DPDPA, health data)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/95 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-[#90A955]/40 shadow-xl text-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-800 bg-gray-200 px-2 py-1 rounded-md cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Elegant Bottom Curve Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z"
              fill="#f9fafb"
            />
          </svg>
        </div>
      </section>

      {/* Main Content Body */}
      <main ref={containerRef} className="bg-gray-50 min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="flex gap-10">
            {/* Desktop Table of Contents Sidebar */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#4F772D] mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Table of Contents
                  </h3>
                  <nav className="space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                    {privacySections.map((s) => {
                      const Icon = s.icon;
                      const isActive = activeSection === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => scrollToSection(s.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all duration-200 cursor-pointer ${
                            isActive
                              ? "bg-[#ECF39E]/60 text-[#31572C] shadow-sm font-semibold"
                              : "text-gray-600 hover:text-[#4F772D] hover:bg-gray-50"
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              isActive ? "text-[#4F772D]" : "text-gray-400"
                            }`}
                          />
                          <span className="truncate">
                            {s.title.replace(/^\d+\.\s*/, "")}
                          </span>
                          {isActive && (
                            <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#4F772D]" />
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* DPO Quick Contact Card */}
                <div className="bg-gradient-to-br from-[#31572C] to-[#4F772D] rounded-2xl p-5 text-white shadow-md">
                  <h4 className="text-sm font-bold flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-[#ECF39E]" /> Data Officer
                  </h4>
                  <p className="text-xs text-[#ECF39E]/90 leading-relaxed mb-4">
                    Have privacy concerns or wish to exercise data rights? Contact our DPO directly.
                  </p>
                  <a
                    href="mailto:dpo@ayursaathi.com"
                    className="inline-flex items-center gap-2 w-full justify-center bg-white/15 hover:bg-white/25 backdrop-blur px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                  >
                    dpo@ayursaathi.com
                  </a>
                </div>
              </div>
            </aside>

            {/* Main Section Content Column */}
            <div className="flex-1 min-w-0 space-y-8">
              {/* Highlight Privacy Guarantee Banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-[#ECF39E]/40 via-white to-[#ECF39E]/40 rounded-2xl border border-[#90A955]/30 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#31572C] text-[#ECF39E] grid place-items-center shrink-0 shadow-md">
                  <Lock className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#31572C]">
                    Ayur Saathi Privacy Guarantee
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                    Your personal health parameters and consultation details stay completely private. Only non-personal herb traceability data (harvest origin, batch certificates) is validated on the public blockchain ledger.
                  </p>
                </div>
              </motion.div>

              {/* No Search Results Notice */}
              {filteredSections.length === 0 && (
                <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
                  <AlertCircle className="w-12 h-12 text-[#4F772D] mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-800">No matching sections found</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Try searching for different terms like "blockchain", "consent", "DPDPA", or "cookies".
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 px-4 py-2 bg-[#31572C] text-white text-xs font-semibold rounded-xl hover:bg-[#4F772D] transition-colors cursor-pointer"
                  >
                    Reset Search
                  </button>
                </div>
              )}

              {/* Dynamic Section Cards */}
              <AnimatePresence>
                {filteredSections.map((section, idx) => {
                  const Icon = section.icon;
                  return (
                    <motion.section
                      key={section.id}
                      id={section.id}
                      custom={idx}
                      variants={cardVariant}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-50px" }}
                      className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8 scroll-mt-24"
                    >
                      {/* Section Header */}
                      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100 flex-wrap">
                        <div className="flex items-center gap-3">
                          <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[#ECF39E]/60 to-[#90A955]/30 grid place-items-center shadow-sm">
                            <Icon className="w-5 h-5 text-[#31572C]" />
                          </div>
                          <h2 className="text-xl md:text-2xl font-bold text-[#31572C]">
                            {section.title}
                          </h2>
                        </div>
                        {section.badge && (
                          <span className="inline-flex items-center gap-1.5 bg-[#ECF39E]/50 text-[#31572C] text-xs font-bold px-3 py-1.5 rounded-full border border-[#90A955]/30">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#4F772D]" />
                            {section.badge}
                          </span>
                        )}
                      </div>

                      {/* Section Content Paragraphs */}
                      {section.content.map((para, pIdx) => (
                        <p
                          key={pIdx}
                          className="text-sm md:text-base text-gray-700 leading-relaxed mb-4"
                        >
                          {para}
                        </p>
                      ))}

                      {/* Bullet Lists */}
                      {section.list && (
                        <ul className="space-y-3 mb-5 pl-1">
                          {section.list.map((item, lIdx) => (
                            <li
                              key={lIdx}
                              className="flex items-start gap-3 text-sm md:text-base text-gray-700"
                            >
                              <span className="shrink-0 mt-1.5 w-2.5 h-2.5 rounded-full bg-[#4F772D]" />
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Subsections Grid / Accordion Cards */}
                      {section.subsections && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
                          {section.subsections.map((sub, sIdx) => (
                            <div
                              key={sIdx}
                              className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-[#90A955]/50 transition-colors"
                            >
                              <h3 className="text-sm font-bold text-[#4F772D] mb-2 flex items-center gap-2">
                                <ChevronRight className="w-4 h-4 text-[#90A955]" />
                                {sub.title}
                              </h3>
                              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                                {sub.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Extra Paragraphs */}
                      {section.extra &&
                        section.extra.map((para, eIdx) => (
                          <p
                            key={eIdx}
                            className="text-sm md:text-base text-gray-700 leading-relaxed mb-4 last:mb-0"
                          >
                            {para}
                          </p>
                        ))}

                      {/* Detailed Contact Information Block */}
                      {section.contactInfo && (
                        <div className="mt-6 bg-gradient-to-br from-[#31572C] via-[#4F772D] to-[#31572C] rounded-2xl p-6 text-white shadow-md">
                          <div className="flex items-center gap-3 mb-4">
                            <Building2 className="w-6 h-6 text-[#ECF39E]" />
                            <div>
                              <h3 className="text-base font-bold">
                                {section.contactInfo.company}
                              </h3>
                              <p className="text-xs text-[#ECF39E]/90">
                                {section.contactInfo.dpoName}
                              </p>
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4 text-xs md:text-sm">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-[#ECF39E]" />
                                <span>
                                  DPO Email:{" "}
                                  <a
                                    href={`mailto:${section.contactInfo.email}`}
                                    className="underline font-semibold hover:text-[#ECF39E] transition-colors"
                                  >
                                    {section.contactInfo.email}
                                  </a>
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-[#ECF39E]" />
                                <span>
                                  Support:{" "}
                                  <a
                                    href={`mailto:${section.contactInfo.support}`}
                                    className="underline font-semibold hover:text-[#ECF39E] transition-colors"
                                  >
                                    {section.contactInfo.support}
                                  </a>
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-[#ECF39E]" />
                                <span>{section.contactInfo.phone}</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <p className="text-white/90">
                                <strong>Registered Office:</strong> {section.contactInfo.address}
                              </p>
                              <p className="text-[#ECF39E]/90">{section.contactInfo.hours}</p>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-white/20 text-xs text-[#ECF39E]/80 leading-relaxed">
                            {section.contactInfo.timelines}
                          </div>
                        </div>
                      )}
                    </motion.section>
                  );
                })}
              </AnimatePresence>

              {/* Bottom Quick Navigation & Summary Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8 text-center"
              >
                <HelpCircle className="w-10 h-10 text-[#4F772D] mx-auto mb-3" />
                <h3 className="text-lg font-bold text-[#31572C] mb-2">
                  Have Questions About Our Legal Terms?
                </h3>
                <p className="text-sm text-gray-600 max-w-xl mx-auto leading-relaxed mb-6">
                  Check our Terms of Service to learn more about user rights, Marketplace purchasing policies, and practitioner guidelines.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/terms-and-conditions"
                    className="inline-flex items-center gap-2 bg-[#31572C] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#4F772D] transition-colors shadow-md"
                  >
                    <FileCheck className="w-4 h-4 text-[#ECF39E]" />
                    Terms of Service
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-white text-[#31572C] border border-[#90A955] px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#ECF39E]/30 transition-colors"
                  >
                    Back to Home
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Scroll-to-Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-[#31572C] text-white shadow-2xl hover:bg-[#4F772D] transition-colors grid place-items-center cursor-pointer"
          title="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}

      <Footer />
    </>
  );
}
