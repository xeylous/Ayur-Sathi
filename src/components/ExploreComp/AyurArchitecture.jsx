"use client";

import {
    Layers,
    Smartphone,
    Server,
    Database,
    ShieldCheck,
    Cpu,
    Globe,
    QrCode,
    Link,
    CloudCog,
    ArrowRight,
    ChevronRight,
} from "lucide-react";

const layers = [
    {
        icon: <Smartphone className="w-6 h-6" />,
        label: "Presentation Layer",
        color: "bg-[#ECF39E] text-[#31572C]",
        border: "border-[#90A955]",
        items: [
            "Farmer Mobile App (SMS / Android)",
            "Consumer Web & Mobile Portal",
            "Admin & Lab Dashboard (Next.js)",
            "QR Code Scanner Interface",
        ],
        description:
            "The user-facing layer that provides role-based interfaces for farmers, consumers, lab technicians, and administrators.",
    },
    {
        icon: <Globe className="w-6 h-6" />,
        label: "API Gateway / BFF Layer",
        color: "bg-[#90A955]/20 text-[#31572C]",
        border: "border-[#4F772D]",
        items: [
            "Next.js API Routes (RESTful)",
            "Role-Based JWT Authentication",
            "Rate Limiting & Input Validation",
            "Webhook Handlers (Payment / Lab Events)",
        ],
        description:
            "Acts as the entry point for all client requests, enforcing authentication, authorization, and protocol translation.",
    },
    {
        icon: <Cpu className="w-6 h-6" />,
        label: "Application / Business Logic Layer",
        color: "bg-[#4F772D]/10 text-[#31572C]",
        border: "border-[#31572C]",
        items: [
            "Herb Batch Registration Service",
            "Lab Certification Workflow Engine",
            "QR Code Generation & Linking Service",
            "Marketplace & Order Management",
            "Smart Contract Trigger Controller",
            "Notification & Alert Service",
        ],
        description:
            "The core domain logic that orchestrates herb lifecycle events from collection through certification to marketplace listing.",
    },
    {
        icon: <Link className="w-6 h-6" />,
        label: "Blockchain Integration Layer",
        color: "bg-[#31572C]/10 text-[#31572C]",
        border: "border-[#31572C]/60",
        items: [
            "Ethereum Testnet (Sepolia) Smart Contracts",
            "Herb Batch Immutable Hash Logging",
            "Lab Approval On-Chain Events",
            "Smart Contract Automated Farmer Payments",
            "Web3.js / Ethers.js Adapters",
        ],
        description:
            "Provides tamper-proof, decentralized record keeping. Every batch creation and lab result is written to the blockchain ensuring immutable provenance.",
    },
    {
        icon: <CloudCog className="w-6 h-6" />,
        label: "Cloud Storage & File Layer",
        color: "bg-[#ECF39E]/60 text-[#31572C]",
        border: "border-[#90A955]/70",
        items: [
            "AWS S3 / Cloudinary (Lab Certificates, Photos)",
            "QR Code Asset Storage",
            "Herb Imagery CDN Delivery",
            "Encrypted Document Vault",
        ],
        description:
            "Handles all binary assets including lab certificates, geo-tagged photographs, and QR code images with CDN-powered delivery.",
    },
    {
        icon: <Database className="w-6 h-6" />,
        label: "Data Layer",
        color: "bg-[#4F772D]/15 text-[#31572C]",
        border: "border-[#4F772D]/50",
        items: [
            "MongoDB Atlas (Primary Database – Users, Batches, Orders)",
            "Redis (Session Cache, OTP, Rate Limit State)",
            "IPFS (Decentralized Metadata Anchoring)",
            "Blockchain State (On-Chain Batch Records)",
        ],
        description:
            "A hybrid data strategy combining MongoDB for relational-style Ayurvedic records, Redis for ephemeral state, and IPFS/blockchain for decentralized proofs.",
    },
    {
        icon: <ShieldCheck className="w-6 h-6" />,
        label: "Security & Compliance Layer",
        color: "bg-[#ECF39E]/40 text-[#31572C]",
        border: "border-[#90A955]/50",
        items: [
            "OTP-Based Identity Verification",
            "JWT + Refresh Token Rotation",
            "AES-256 Data Encryption at Rest",
            "TLS 1.3 in Transit",
            "ABHA / AYUSH Regulatory Compliance Hooks",
            "Audit Log Trail for All Transactions",
        ],
        description:
            "End-to-end security across all layers: identity, transport, storage, and regulatory reporting. Built to align with AYUSH Ministry standards.",
    },
];

const dataFlow = [
    { step: "Farmer geo-tags herb collection via SMS / App" },
    { step: "API Gateway validates identity & passes to Business Logic" },
    { step: "Batch Service creates record in MongoDB & triggers blockchain write" },
    { step: "Smart Contract logs immutable hash on Ethereum" },
    { step: "Lab uploads QA certificate → stored in Cloud, reference on-chain" },
    { step: "QR Code generated linking batch ↔ blockchain hash ↔ lab cert" },
    { step: "Marketplace lists verified batch at government-assigned rate" },
    { step: "Consumer scans QR → full provenance rendered in real-time" },
];

export default function AyurArchitecture() {
    return (
        <div className="max-w-5xl mx-auto text-gray-800 pb-8">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#4F772D] mb-2 flex items-center gap-3">
                    <Layers className="w-8 h-8" />
                    Ayur Architecture
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                    AyurSaathi is built on a <strong>layered, blockchain-backed microservice architecture</strong> that
                    ensures security, transparency, and scalability from farm to consumer. Each layer has a
                    distinct responsibility, enabling independent evolution without system-wide disruption.
                </p>
            </div>

            {/* Architecture Layers */}
            <div className="space-y-4 mb-12">
                <h3 className="text-xl font-bold text-[#31572C] mb-4">System Architecture Layers</h3>
                {layers.map((layer, idx) => (
                    <div
                        key={idx}
                        className={`rounded-2xl border-2 ${layer.border} bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden`}
                    >
                        {/* Layer Header */}
                        <div className={`flex items-center gap-3 px-5 py-3 ${layer.color} font-semibold text-base`}>
                            {layer.icon}
                            <span>
                                Layer {idx + 1}: {layer.label}
                            </span>
                        </div>

                        {/* Layer Body */}
                        <div className="px-5 py-4 grid md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-3 leading-relaxed">{layer.description}</p>
                                <ul className="space-y-2">
                                    {layer.items.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                            <ChevronRight className="w-4 h-4 text-[#90A955] mt-0.5 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Visual Badge */}
                            <div className="hidden md:flex items-center justify-center">
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${layer.color} border-2 ${layer.border} opacity-80`}>
                                    <div className="scale-150">{layer.icon}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Data Flow Section – Animated Timeline */}
            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(18px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes lineDraw {
                    from { transform: scaleY(0); opacity: 0; }
                    to   { transform: scaleY(1); opacity: 1; }
                }
                @keyframes pulseRing {
                    0%   { box-shadow: 0 0 0 0   rgba(79,119,45,0.55); }
                    70%  { box-shadow: 0 0 0 10px rgba(79,119,45,0);    }
                    100% { box-shadow: 0 0 0 0   rgba(79,119,45,0);     }
                }
                @keyframes shimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position:  200% center; }
                }
                .flow-step {
                    opacity: 0;
                    animation: fadeSlideUp 0.55s ease forwards;
                }
                .flow-dot {
                    animation: pulseRing 2s ease-out infinite;
                }
                .flow-connector {
                    transform-origin: top center;
                    animation: lineDraw 0.4s ease forwards;
                    background: linear-gradient(to bottom, #4F772D 0%, #90A955 100%);
                }
                .flow-card {
                    background: linear-gradient(270deg, #f9fdf2, #ffffff, #f0f8e8);
                    background-size: 400% 400%;
                    transition: box-shadow 0.25s ease, transform 0.25s ease;
                }
                .flow-card:hover {
                    box-shadow: 0 6px 24px rgba(79,119,45,0.15);
                    transform: translateX(4px);
                }
            `}</style>

            <div className="mb-12">
                <h3 className="text-xl font-bold text-[#31572C] mb-6">End-to-End Data Flow</h3>

                <div className="relative pl-6">
                    {/* Continuous vertical rail */}
                    <div
                        className="absolute left-[1.45rem] top-4 bottom-4 w-0.5 rounded-full"
                        style={{
                            background: "linear-gradient(to bottom, #4F772D, #90A955, #ECF39E)",
                            opacity: 0.45,
                        }}
                    />

                    {dataFlow.map((step, idx) => (
                        <div
                            key={idx}
                            className="flow-step relative flex items-start gap-5 mb-6 last:mb-0"
                            style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                            {/* Animated dot node */}
                            <div
                                className="flow-dot flex-shrink-0 relative z-10 w-9 h-9 rounded-full bg-[#4F772D] text-white flex items-center justify-center text-sm font-bold border-2 border-white"
                                style={{ animationDelay: `${idx * 0.15 + 0.3}s` }}
                            >
                                {idx + 1}
                            </div>

                            {/* Step card */}
                            <div className="flow-card flex-1 border border-[#90A955]/35 rounded-2xl px-5 py-3.5 text-sm text-gray-700 flex items-center gap-3 shadow-sm">
                                <ArrowRight
                                    className="w-4 h-4 flex-shrink-0"
                                    style={{ color: "#4F772D" }}
                                />
                                <span className="leading-snug">{step.step}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Architecture Principles */}
            <div className="p-6 bg-[#ECF39E]/50 rounded-3xl border border-[#90A955]/30">
                <h3 className="text-xl font-bold text-[#31572C] mb-4 flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    Core Architectural Principles
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        {
                            title: "Decentralization",
                            desc: "Critical records live on IPFS and Ethereum — no single point of failure or tampering.",
                        },
                        {
                            title: "Separation of Concerns",
                            desc: "Each layer is independently deployable, testable, and scalable without cross-layer coupling.",
                        },
                        {
                            title: "Security by Design",
                            desc: "Identity verification, encryption, and audit logs are first-class citizens at every layer.",
                        },
                        {
                            title: "Regulatory Alignment",
                            desc: "Architecture hooks for AYUSH Ministry standards, ABHA integration, and FSSAI traceability.",
                        },
                        {
                            title: "Scalability",
                            desc: "Stateless API layer + Redis caching + CDN-backed assets handle national-scale herb trading volume.",
                        },
                        {
                            title: "Transparency",
                            desc: "Blockchain finality ensures any participant can independently verify the authenticity of any herb batch.",
                        },
                    ].map((principle, idx) => (
                        <div key={idx} className="bg-white rounded-xl p-4 border border-[#90A955]/30 shadow-sm hover:shadow-md transition-shadow">
                            <h4 className="font-semibold text-[#4F772D] mb-1">{principle.title}</h4>
                            <p className="text-sm text-gray-600">{principle.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
