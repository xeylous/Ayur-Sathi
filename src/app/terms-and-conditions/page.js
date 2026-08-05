"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Shield,
  FileText,
  Users,
  ShoppingBag,
  Leaf,
  AlertTriangle,
  Scale,
  Lock,
  Globe,
  RefreshCw,
  Mail,
  ChevronRight,
  ArrowUp,
} from "lucide-react";

/* ───────────────── Terms data ───────────────── */
const EFFECTIVE_DATE = "August 1, 2026";
const LAST_UPDATED = "August 1, 2026";

const sections = [
  {
    id: "acceptance",
    icon: FileText,
    title: "1. Acceptance of Terms",
    content: [
      `By accessing or using the Ayur Saathi platform ("Platform"), including its website, mobile applications, APIs, and any associated services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service ("Terms"). These Terms constitute a legally binding agreement between you ("User," "you," or "your") and Ayur Saathi Technologies Pvt. Ltd. ("Ayur Saathi," "we," "us," or "our"), a company registered under the laws of India.`,
      `If you do not agree to these Terms in their entirety, you must immediately discontinue use of the Platform. Your continued use of the Platform following any modifications to these Terms shall constitute acceptance of such modifications.`,
      `You represent and warrant that you are at least 18 years of age, or the age of legal majority in your jurisdiction, and have the legal capacity to enter into these Terms. If you are using the Platform on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms.`,
    ],
  },
  {
    id: "services",
    icon: Leaf,
    title: "2. Description of Services",
    content: [
      `Ayur Saathi is a blockchain-powered Ayurvedic herb traceability and wellness platform that provides the following services:`,
    ],
    list: [
      "Geo-tagged harvest tracking and documentation for Ayurvedic herbs and botanicals",
      "Lab-certified quality testing integration with NABL-accredited and AYUSH-recognized laboratories",
      "QR-verified consumer provenance — enabling end-users to verify the complete journey of each herb from farm to shelf",
      "Ayurvedic consultation booking with BAMS-qualified and registered practitioners",
      "A curated marketplace for authentic, traceability-verified Ayurvedic products",
      "An educational herb library with traditional usage references, pharmacological data, and seasonal guidance",
      "AI-assisted wellness recommendations based on Ayurvedic principles (Prakriti analysis)",
      "Blog and community content curated by Ayurveda experts and practitioners",
    ],
    extra: [
      `We reserve the right to modify, suspend, or discontinue any aspect of the Platform at any time, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the services.`,
    ],
  },
  {
    id: "accounts",
    icon: Users,
    title: "3. User Accounts & Registration",
    content: [
      `To access certain features of the Platform, you must create an account. When registering, you agree to:`,
    ],
    list: [
      "Provide accurate, current, and complete registration information, including your full legal name, valid email address, and phone number",
      "Maintain and promptly update your account information to keep it accurate and current",
      "Maintain the confidentiality of your login credentials, including passwords and OTPs",
      "Accept full responsibility for all activities that occur under your account, whether or not authorized by you",
      "Notify Ayur Saathi immediately upon becoming aware of any unauthorized access to or use of your account",
      "Not create multiple accounts for deceptive purposes or share your account credentials with third parties",
    ],
    extra: [
      `Ayur Saathi supports multiple account types, including Consumer, Farmer, Lab Analyst, Manufacturer, and Administrator accounts. Each account type carries specific privileges, responsibilities, and access levels. Misrepresentation of your account type or credentials is a violation of these Terms and may result in immediate termination.`,
      `We reserve the right to suspend or terminate any account that we reasonably believe violates these Terms, engages in fraudulent activity, or poses a risk to the Platform's integrity or other users' safety.`,
    ],
  },
  {
    id: "marketplace",
    icon: ShoppingBag,
    title: "4. Marketplace & Transactions",
    content: [
      `The Ayur Saathi Marketplace connects consumers with verified manufacturers, farmers, and artisans who produce authentic Ayurvedic products. By using the Marketplace, you agree to the following:`,
    ],
    subsections: [
      {
        title: "4.1 Product Listings & Accuracy",
        text: "All products listed on the Marketplace are provided by third-party sellers who are solely responsible for the accuracy of product descriptions, ingredients, claims, and pricing. While Ayur Saathi implements a rigorous verification process — including blockchain-based traceability and lab testing validation — we do not manufacture products and cannot guarantee that all product information is free from error.",
      },
      {
        title: "4.2 Pricing & Payment",
        text: "All prices are displayed in Indian Rupees (₹) unless otherwise specified. Prices are inclusive of applicable taxes unless stated otherwise. Payment is processed through secure, PCI-DSS compliant third-party payment gateways. Ayur Saathi does not store credit card or debit card information on its servers. By completing a purchase, you authorize the applicable charges to your chosen payment method.",
      },
      {
        title: "4.3 Order Fulfilment & Shipping",
        text: "Estimated delivery timelines are provided for reference purposes only and are not guaranteed. Ayur Saathi works with third-party logistics partners and is not directly responsible for shipping delays, losses, or damages during transit. However, we actively assist in resolution of delivery-related disputes.",
      },
      {
        title: "4.4 Returns & Refunds",
        text: "Products may be returned within 7 days of delivery if they arrive damaged, defective, or materially different from the product description. Perishable goods, opened consumable items, and personalized products are non-returnable unless defective. Approved refunds are processed within 7–10 business days to the original payment method. Refund policies of individual sellers may apply in addition to our platform-wide policy.",
      },
      {
        title: "4.5 Prohibited Conduct",
        text: "Users may not list, sell, or purchase products that violate applicable laws, contain prohibited substances, make unsubstantiated medical claims, or infringe upon the intellectual property rights of others. Ayur Saathi reserves the right to remove any listing and suspend any seller account that violates these provisions.",
      },
    ],
  },
  {
    id: "consultation",
    icon: Shield,
    title: "5. Consultation Services",
    content: [
      `Ayur Saathi facilitates connections between users and qualified Ayurvedic practitioners. By using the consultation features, you understand and agree to the following:`,
    ],
    list: [
      "Consultations provided through the Platform are for general Ayurvedic wellness guidance only and do not constitute medical advice, diagnosis, or treatment under modern medicine",
      "All practitioners listed on the Platform are independently verified for valid BAMS (Bachelor of Ayurvedic Medicine and Surgery) or equivalent qualifications recognized by AYUSH (Ministry of Ayush, Government of India)",
      "Ayur Saathi does not employ practitioners directly; they are independent professionals who use the Platform to offer their services",
      "You should always consult a licensed allopathic physician for serious, acute, or emergency medical conditions before relying solely on Ayurvedic recommendations",
      "Any dietary supplements, herbal preparations, or lifestyle modifications recommended during consultations should be discussed with your primary healthcare provider, especially if you are pregnant, nursing, taking prescription medications, or have pre-existing medical conditions",
      "Consultation fees, cancellation policies, and scheduling are subject to the individual practitioner's terms, which are displayed prior to booking",
    ],
  },
  {
    id: "blockchain",
    icon: Lock,
    title: "6. Blockchain & Traceability",
    content: [
      `A core feature of Ayur Saathi is its blockchain-powered traceability infrastructure. By using the Platform's traceability features, you acknowledge the following:`,
    ],
    list: [
      "Traceability records, once committed to the blockchain, are immutable and cannot be altered or deleted. This is by design to ensure data integrity and consumer trust",
      "Batch IDs, QR codes, and provenance records are generated based on data submitted by registered farmers, lab analysts, and manufacturers. While our verification processes are rigorous, Ayur Saathi cannot independently verify every field datum at the point of origin",
      "QR code scanning provides consumers with a transparent view of the supply chain, including harvest location, testing results, processing details, and certifications associated with a given batch",
      "Any attempt to falsify, manipulate, or forge traceability data constitutes a serious violation of these Terms and may be reported to relevant regulatory authorities, including the AYUSH Ministry and law enforcement agencies",
      "Blockchain transaction data may be publicly visible on the distributed ledger. Personal identifying information of users is not stored on-chain",
    ],
  },
  {
    id: "ip",
    icon: Scale,
    title: "7. Intellectual Property Rights",
    content: [
      `All content, features, and functionality on the Platform — including but not limited to text, graphics, logos, icons, images, audio clips, software code, UI/UX design, database structures, and traceability algorithms — are the exclusive property of Ayur Saathi Technologies Pvt. Ltd. or its licensors, and are protected under applicable copyright, trademark, patent, and trade secret laws of India and international treaties.`,
      `You may not reproduce, distribute, modify, create derivative works from, publicly display, publicly perform, republish, download, store, or transmit any material from the Platform without prior written consent from Ayur Saathi, except as follows:`,
    ],
    list: [
      "You may temporarily store copies of materials in RAM incidental to normal browser access",
      "You may store files that are automatically cached by your browser for display enhancement",
      "You may print or download one copy of a reasonable number of pages for personal, non-commercial use, provided you do not modify the content and retain all copyright and proprietary notices",
    ],
    extra: [
      `The Ayur Saathi name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of Ayur Saathi Technologies Pvt. Ltd. You may not use such marks without our prior written permission.`,
    ],
  },
  {
    id: "privacy",
    icon: Lock,
    title: "8. Privacy & Data Protection",
    content: [
      `Your privacy is critically important to us. Our collection, use, and protection of your personal data is governed by our comprehensive Privacy Policy, which is incorporated into these Terms by reference. Key aspects include:`,
    ],
    list: [
      "We collect only the minimum personal data necessary to provide our services, in compliance with the Digital Personal Data Protection Act, 2023 (DPDPA) and applicable Indian data protection laws",
      "Your data is encrypted in transit (TLS 1.3) and at rest (AES-256). We employ industry-standard security measures including firewalls, intrusion detection systems, and regular security audits",
      "We do not sell, rent, or trade your personal information to third parties for marketing purposes. Data sharing with third parties is limited to service provision (e.g., payment processors, logistics partners) and legal compliance",
      "You have the right to access, correct, delete, and port your personal data, subject to applicable legal requirements and legitimate business interests",
      "Health-related data collected during consultations is treated with heightened confidentiality and is accessible only to the relevant practitioner and you, unless you explicitly consent to wider access",
      "Cookies and similar tracking technologies are used to improve your experience. You can manage cookie preferences through your browser settings or our cookie management interface",
    ],
    extra: [
      `For complete details, please review our Privacy Policy at /privacy. If you have data protection concerns, you may contact our Data Protection Officer at dpo@ayursaathi.com.`,
    ],
  },
  {
    id: "prohibited",
    icon: AlertTriangle,
    title: "9. Prohibited Activities",
    content: [
      `You agree not to engage in any of the following prohibited activities when using the Platform:`,
    ],
    list: [
      "Using the Platform for any unlawful purpose or in violation of any applicable local, state, national, or international law or regulation",
      "Impersonating any person or entity, or falsely claiming an affiliation with any person or entity, including Ayur Saathi employees, practitioners, or partners",
      "Submitting false, misleading, or fraudulent information, including falsified traceability data, fake reviews, or fabricated credentials",
      "Attempting to gain unauthorized access to any part of the Platform, other user accounts, computer systems, or networks connected to the Platform through hacking, password mining, or any other means",
      "Interfering with or disrupting the Platform's infrastructure, servers, or networks, including through denial-of-service attacks, malware distribution, or exploitation of software vulnerabilities",
      "Scraping, crawling, or using automated tools to extract data from the Platform without prior written authorization",
      "Using the Platform to distribute unsolicited advertising, spam, chain letters, or pyramid schemes",
      "Uploading or transmitting viruses, trojans, worms, or any other malicious code designed to interrupt, destroy, or limit the functionality of the Platform",
      "Attempting to reverse-engineer, decompile, or disassemble any software or algorithms used by the Platform",
      "Engaging in any activity that places an unreasonable or disproportionately large load on the Platform's infrastructure",
    ],
  },
  {
    id: "liability",
    icon: Shield,
    title: "10. Limitation of Liability",
    content: [
      `TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, AYUR SAATHI, ITS DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, PARTNERS, AND LICENSORS SHALL NOT BE LIABLE FOR:`,
    ],
    list: [
      "Any indirect, incidental, special, consequential, punitive, or exemplary damages, including but not limited to damages for loss of profits, goodwill, data, or other intangible losses",
      "Any damages arising from your use of or inability to use the Platform, including any reliance on Ayurvedic advice, herbal product usage, or consultation outcomes",
      "Any damages resulting from unauthorized access to or alteration of your data transmissions",
      "Any damages arising from the conduct of third parties on the Platform, including other users, sellers, practitioners, or logistics partners",
      "Any damages exceeding the total amount paid by you to Ayur Saathi during the twelve (12) months preceding the event giving rise to the claim",
    ],
    extra: [
      `Some jurisdictions do not allow the exclusion or limitation of certain damages. In such jurisdictions, our liability shall be limited to the maximum extent permitted by law. Nothing in these Terms shall exclude liability for death or personal injury caused by negligence, fraud, or fraudulent misrepresentation.`,
      `THE PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE.`,
    ],
  },
  {
    id: "indemnification",
    icon: Scale,
    title: "11. Indemnification",
    content: [
      `You agree to defend, indemnify, and hold harmless Ayur Saathi, its parent company, subsidiaries, affiliates, officers, directors, employees, agents, licensors, and service providers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to:`,
    ],
    list: [
      "Your violation of these Terms or any applicable law or regulation",
      "Your use or misuse of the Platform, including any data or content you submit, post, or transmit through the Platform",
      "Your violation of any third-party rights, including intellectual property, privacy, or publicity rights",
      "Any dispute between you and a third-party seller, practitioner, or other user of the Platform",
      "Any claim that your submitted content caused damage to a third party",
    ],
  },
  {
    id: "governing",
    icon: Globe,
    title: "12. Governing Law & Dispute Resolution",
    content: [
      `These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles. Any disputes arising out of or relating to these Terms or the Platform shall be resolved as follows:`,
    ],
    subsections: [
      {
        title: "12.1 Informal Resolution",
        text: "Before filing any formal claim, you agree to first attempt to resolve the dispute informally by contacting us at legal@ayursaathi.com. We will attempt to resolve the dispute within 30 business days of receiving your notice.",
      },
      {
        title: "12.2 Mediation",
        text: "If informal resolution is unsuccessful, the parties agree to submit the dispute to mediation under the Mediation Act, 2023, with a mutually agreed mediator seated in New Delhi, India.",
      },
      {
        title: "12.3 Arbitration",
        text: "If mediation is unsuccessful, the dispute shall be referred to and finally resolved by binding arbitration in accordance with the Arbitration and Conciliation Act, 1996 (as amended). The arbitration shall be conducted by a sole arbitrator, seated in New Delhi, India. The language of the arbitration shall be English. The arbitrator's award shall be final and binding.",
      },
      {
        title: "12.4 Jurisdiction",
        text: "Notwithstanding the above, either party may seek injunctive or other equitable relief in the courts of New Delhi, India, for matters relating to intellectual property infringement or data security breaches.",
      },
    ],
  },
  {
    id: "modifications",
    icon: RefreshCw,
    title: "13. Modifications to Terms",
    content: [
      `Ayur Saathi reserves the right to revise and update these Terms at any time, at our sole discretion. Changes become effective immediately upon posting to the Platform, unless otherwise specified. Material changes will be communicated through:`,
    ],
    list: [
      "A prominent notice on the Platform's homepage or dashboard",
      "Email notification to the address associated with your account",
      "An in-app notification requiring acknowledgment before continued use",
    ],
    extra: [
      `Your continued use of the Platform following the posting of revised Terms means that you accept and agree to the changes. You are advised to review these Terms periodically to stay informed of any updates. The "Last Updated" date at the top of this page indicates when the latest revision was made.`,
    ],
  },
  {
    id: "contact",
    icon: Mail,
    title: "14. Contact Information",
    content: [
      `If you have any questions, concerns, or feedback regarding these Terms of Service, please contact us through any of the following channels:`,
    ],
    contactInfo: {
      company: "Ayur Saathi Technologies Pvt. Ltd.",
      email: "legal@ayursaathi.com",
      support: "ayursaathi@gmail.com",
      phone: "+91 12345 67890",
      address:
        "Registered Office: 42, Green Valley Business Park, Sector 62, Noida, Uttar Pradesh 201301, India",
      hours:
        "Business Hours: Monday – Saturday, 9:00 AM – 6:00 PM IST (excluding national holidays)",
      dpo: "Data Protection Officer: dpo@ayursaathi.com",
      grievance:
        "Grievance Officer: grievance@ayursaathi.com (as required under the Information Technology Act, 2000 and IT Rules, 2021)",
    },
  },
];

/* ───────────────── Component ───────────────── */
export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("acceptance");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const containerRef = useRef(null);

  // scroll progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // scroll spy
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

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // scroll-to-top visibility
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  /* ─── Fade-in wrapper ─── */
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <>
      <Navbar />

      {/* Progress bar */}
      <motion.div
        className="fixed top-16 left-0 right-0 h-[3px] z-50 origin-left"
        style={{
          scaleX,
          background:
            "linear-gradient(90deg, #90A955, #4F772D, #31572C)",
        }}
      />

      {/* Hero banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#31572C] via-[#4F772D] to-[#31572C]">
        {/* Decorative dots */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, #ECF39E 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-6"
          >
            <Shield className="w-4 h-4 text-[#ECF39E]" />
            <span className="text-sm font-medium text-[#ECF39E]">
              Legal Agreement
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight"
          >
            Terms of Service
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-5 text-lg md:text-xl text-[#ECF39E]/90 max-w-2xl mx-auto leading-relaxed"
          >
            Please read these terms carefully before using Ayur Saathi.
            They govern your access to and use of our platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/80"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Effective: {EFFECTIVE_DATE}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/40 hidden sm:block" />
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Last Updated: {LAST_UPDATED}
            </span>
          </motion.div>
        </div>

        {/* Wave divider */}
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

      {/* Main content area */}
      <main
        ref={containerRef}
        className="bg-gray-50 min-h-screen pb-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="flex gap-10">
            {/* Sticky sidebar — Table of Contents (desktop) */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-24">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#4F772D] mb-5">
                    Table of Contents
                  </h3>
                  <nav className="space-y-1">
                    {sections.map((s) => {
                      const Icon = s.icon;
                      const isActive = activeSection === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => scrollToSection(s.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all duration-200 cursor-pointer ${
                            isActive
                              ? "bg-[#ECF39E]/60 text-[#31572C] shadow-sm"
                              : "text-gray-500 hover:text-[#4F772D] hover:bg-gray-50"
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              isActive
                                ? "text-[#4F772D]"
                                : "text-gray-400"
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

                {/* Quick contact card */}
                <div className="mt-6 bg-gradient-to-br from-[#31572C] to-[#4F772D] rounded-2xl p-5 text-white shadow-lg">
                  <h4 className="text-sm font-bold mb-2">Need Help?</h4>
                  <p className="text-xs text-[#ECF39E]/80 leading-relaxed mb-4">
                    If you have questions about these terms, our legal
                    team is here to assist you.
                  </p>
                  <a
                    href="mailto:legal@ayursaathi.com"
                    className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    legal@ayursaathi.com
                  </a>
                </div>
              </div>
            </aside>

            {/* Content cards */}
            <div className="flex-1 min-w-0 space-y-8">
              {/* Intro card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-[#ECF39E]/50 grid place-items-center">
                    <FileText className="w-5 h-5 text-[#31572C]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#31572C]">
                      Introduction
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                      Welcome to Ayur Saathi. These Terms of Service
                      ("Terms") govern your use of our Platform and all
                      associated services. By accessing or using the Ayur
                      Saathi website, mobile applications, APIs, or any
                      related services, you agree to comply with and be
                      bound by these Terms. If you do not agree, you may
                      not access or use our services.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-1.5 bg-[#ECF39E]/40 text-[#31572C] text-xs font-semibold px-3 py-1.5 rounded-full">
                        <Globe className="w-3 h-3" /> Jurisdiction: India
                      </span>
                      <span className="inline-flex items-center gap-1.5 bg-[#ECF39E]/40 text-[#31572C] text-xs font-semibold px-3 py-1.5 rounded-full">
                        <Scale className="w-3 h-3" /> DPDPA 2023 Compliant
                      </span>
                      <span className="inline-flex items-center gap-1.5 bg-[#ECF39E]/40 text-[#31572C] text-xs font-semibold px-3 py-1.5 rounded-full">
                        <Shield className="w-3 h-3" /> AYUSH Guidelines
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Section cards */}
              {sections.map((section, idx) => {
                const Icon = section.icon;
                return (
                  <motion.section
                    key={section.id}
                    id={section.id}
                    custom={idx}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 scroll-mt-24"
                  >
                    {/* Section header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#ECF39E]/60 to-[#90A955]/30 grid place-items-center shadow-sm">
                        <Icon className="w-5 h-5 text-[#31572C]" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-[#31572C]">
                        {section.title}
                      </h2>
                    </div>

                    {/* Paragraphs */}
                    {section.content.map((para, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-sm md:text-base text-gray-700 leading-relaxed mb-4"
                      >
                        {para}
                      </p>
                    ))}

                    {/* Bullet list */}
                    {section.list && (
                      <ul className="space-y-3 mb-5">
                        {section.list.map((item, lIdx) => (
                          <li
                            key={lIdx}
                            className="flex items-start gap-3 text-sm md:text-base text-gray-700"
                          >
                            <span className="shrink-0 mt-1.5 w-2 h-2 rounded-full bg-[#90A955]" />
                            <span className="leading-relaxed">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Subsections */}
                    {section.subsections &&
                      section.subsections.map((sub, sIdx) => (
                        <div
                          key={sIdx}
                          className="mb-5 last:mb-0 bg-gray-50 rounded-xl p-5 border border-gray-100"
                        >
                          <h3 className="text-sm md:text-base font-bold text-[#4F772D] mb-2">
                            {sub.title}
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {sub.text}
                          </p>
                        </div>
                      ))}

                    {/* Extra paragraphs */}
                    {section.extra &&
                      section.extra.map((para, eIdx) => (
                        <p
                          key={eIdx}
                          className="text-sm md:text-base text-gray-700 leading-relaxed mb-4 last:mb-0"
                        >
                          {para}
                        </p>
                      ))}

                    {/* Contact info block */}
                    {section.contactInfo && (
                      <div className="mt-4 bg-gradient-to-br from-[#31572C] to-[#4F772D] rounded-xl p-6 text-white">
                        <h3 className="text-base font-bold mb-4">
                          {section.contactInfo.company}
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-[#ECF39E]" />
                              <span>
                                Legal:{" "}
                                <a
                                  href={`mailto:${section.contactInfo.email}`}
                                  className="underline hover:text-[#ECF39E] transition-colors"
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
                                  className="underline hover:text-[#ECF39E] transition-colors"
                                >
                                  {section.contactInfo.support}
                                </a>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-[#ECF39E]" />
                              <span>
                                DPO:{" "}
                                <a
                                  href="mailto:dpo@ayursaathi.com"
                                  className="underline hover:text-[#ECF39E] transition-colors"
                                >
                                  dpo@ayursaathi.com
                                </a>
                              </span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <p>{section.contactInfo.address}</p>
                            <p>{section.contactInfo.phone}</p>
                            <p>{section.contactInfo.hours}</p>
                          </div>
                        </div>
                        <p className="mt-4 text-xs text-[#ECF39E]/70 leading-relaxed">
                          {section.contactInfo.grievance}
                        </p>
                      </div>
                    )}
                  </motion.section>
                );
              })}

              {/* Closing acknowledgment */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-[#ECF39E]/30 via-white to-[#ECF39E]/30 rounded-2xl border border-[#90A955]/20 p-6 md:p-8 text-center"
              >
                <Shield className="w-10 h-10 text-[#4F772D] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#31572C] mb-2">
                  Your Trust Matters
                </h3>
                <p className="text-sm text-gray-600 max-w-xl mx-auto leading-relaxed mb-5">
                  By continuing to use Ayur Saathi, you acknowledge that you
                  have read, understood, and agree to be bound by these Terms
                  of Service and our Privacy Policy. We are committed to
                  transparency, authenticity, and your wellness.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/privacy"
                    className="inline-flex items-center gap-2 bg-[#31572C] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#4F772D] transition-colors shadow-md"
                  >
                    <Lock className="w-4 h-4" />
                    Privacy Policy
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

      {/* Scroll-to-top button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-[#31572C] text-white shadow-xl hover:bg-[#4F772D] transition-colors grid place-items-center cursor-pointer"
          title="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}

      <Footer />
    </>
  );
}
