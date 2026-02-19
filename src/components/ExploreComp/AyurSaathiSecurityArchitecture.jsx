"use client";

import { useState } from "react";
import {
    ShieldCheck,
    Lock,
    KeyRound,
    Eye,
    AlertTriangle,
    FileCheck2,
    ServerCrash,
    Fingerprint,
    RefreshCw,
    CloudLightning,
    ChevronDown,
    ChevronRight,
    CheckCircle2,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────────────── */

const defenceLayers = [
    {
        icon: <Fingerprint className="w-6 h-6" />,
        title: "Identity & Authentication",
        color: "bg-[#ECF39E] text-[#31572C]",
        border: "border-[#90A955]",
        points: [
            "OTP-based identity verification via SMS (SMS Gateway)",
            "JWT access tokens with short expiry + sliding refresh token rotation",
            "Role-Based Access Control (RBAC) — Farmer / Lab / Admin / Consumer",
            "Session binding to device fingerprint to prevent token theft",
            "Brute-force protection: Redis-backed rate limiting on login endpoints",
        ],
        summary:
            "Only verified identities can interact with the system. Token theft and replay attacks are mitigated by rotation and device binding.",
    },
    {
        icon: <Lock className="w-6 h-6" />,
        title: "Data Encryption",
        color: "bg-[#90A955]/20 text-[#31572C]",
        border: "border-[#4F772D]",
        points: [
            "AES-256-GCM encryption for all sensitive data at rest (MongoDB, S3)",
            "TLS 1.3 enforced for all API, WebSocket, and CDN connections in transit",
            "Lab certificates & farmer identity documents stored in encrypted S3 vaults",
            "Blockchain hashes serve as cryptographic proofs — never store raw secrets on-chain",
            "Environment secrets managed via Vercel / AWS Secrets Manager — never in source code",
        ],
        summary:
            "Data is encrypted both at rest and in transit with industry-standard algorithms, making interception and storage breaches ineffective.",
    },
    {
        icon: <Eye className="w-6 h-6" />,
        title: "API Security & Input Validation",
        color: "bg-[#4F772D]/10 text-[#31572C]",
        border: "border-[#31572C]",
        points: [
            "Strict schema validation with Zod on all API routes before processing",
            "SQL / NoSQL injection prevention via parameterised Mongoose queries",
            "CORS policy restricts origins to whitelisted domains only",
            "Helmet.js security headers: CSP, X-Frame-Options, HSTS, Referrer-Policy",
            "API rate limiting per user ID + IP using Redis sliding windows",
            "File upload type & size validation before S3 PUT to block malicious uploads",
        ],
        summary:
            "Every API surface is hardened against injection, CSRF, and abuse with layered validation and strict header policies.",
    },
    {
        icon: <CloudLightning className="w-6 h-6" />,
        title: "Blockchain Immutability & Tamper Evidence",
        color: "bg-[#31572C]/10 text-[#31572C]",
        border: "border-[#31572C]/60",
        points: [
            "Each herb batch record is SHA-256 hashed before writing to Ethereum",
            "Smart contracts enforce write-only semantics — no update or delete",
            "Batch hash stored on IPFS provides decentralised content addressing",
            "Any record tampering in MongoDB is detectable by re-hashing and comparing on-chain",
            "Audit trail events (batch creation, lab approval, sale) emit immutable on-chain logs",
        ],
        summary:
            "The blockchain layer acts as an independent truth anchor — no database manipulation can go undetected without on-chain evidence.",
    },
    {
        icon: <ServerCrash className="w-6 h-6" />,
        title: "Infrastructure & Availability",
        color: "bg-[#ECF39E]/60 text-[#31572C]",
        border: "border-[#90A955]/70",
        points: [
            "Deployed on Vercel edge network with automatic geo-distributed CDN caching",
            "MongoDB Atlas with automated backups every 6 hours and point-in-time recovery",
            "Redis (Upstash) with replication for session / rate-limit state resilience",
            "Zero-downtime rolling deployments; health-check endpoints monitored every 60 s",
            "DDoS protection via Vercel's built-in traffic shaping and Cloudflare proxying",
        ],
        summary:
            "The platform achieves high availability through geo-replication, automated failover, and DDoS mitigation at the edge.",
    },
    {
        icon: <FileCheck2 className="w-6 h-6" />,
        title: "Regulatory Compliance & Audit",
        color: "bg-[#4F772D]/15 text-[#31572C]",
        border: "border-[#4F772D]/50",
        points: [
            "AYUSH Ministry data residency: data stored in India-region AWS / MongoDB clusters",
            "ABHA integration hooks for identity anchoring to national health registry",
            "FSSAI traceability format compatibility for herbal product records",
            "GDPR-aligned data minimisation: personal data pseudonymised in analytics queries",
            "Full audit log of every CRUD operation written to an append-only audit collection",
            "Role-based data masking: consumers never see farmer PII, only batch metadata",
        ],
        summary:
            "Built to align with AYUSH, FSSAI, and ABHA regulatory frameworks with audit-proof logging and data minimisation practices.",
    },
];

const threatModel = [
    { threat: "Fake farmer identity", mitigation: "OTP + Document verification + RBAC" },
    { threat: "Batch record tampering", mitigation: "SHA-256 hash anchored on Ethereum" },
    { threat: "JWT token theft", mitigation: "Refresh token rotation + device binding" },
    { threat: "API abuse / DDoS", mitigation: "Redis rate limiting + Vercel edge DDoS protection" },
    { threat: "Lab certificate forgery", mitigation: "Cloud-stored cert + on-chain reference hash" },
    { threat: "Database breach", mitigation: "AES-256 encryption at rest + least-privilege IAM" },
    { threat: "Malicious file upload", mitigation: "MIME + size validation before S3 write" },
    { threat: "Insider data leakage", mitigation: "Role-based PII masking + append-only audit log" },
];

const incidentSteps = [
    { step: "Alert triggered by anomaly detector / monitoring (uptime, error-rate spike)" },
    { step: "On-call engineer receives PagerDuty / Slack alert within 60 seconds" },
    { step: "Suspected compromised token / session is revoked immediately in Redis" },
    { step: "Affected API routes temporarily throttled to prevent further exploitation" },
    { step: "Root cause identified via append-only audit log + blockchain event trace" },
    { step: "Patch deployed via zero-downtime Vercel rollout" },
    { step: "Post-mortem report filed; regulatory notification if PII was involved" },
];

const complianceBadges = [
    { label: "AYUSH Ministry", sub: "Data Residency" },
    { label: "FSSAI", sub: "Traceability Format" },
    { label: "ABHA", sub: "Identity Hooks" },
    { label: "GDPR-aligned", sub: "Data Minimisation" },
    { label: "AES-256", sub: "Encryption at Rest" },
    { label: "TLS 1.3", sub: "Encryption in Transit" },
];

/* ─── Component ─────────────────────────────────────────────── */

export default function AyurSaathiSecurityArchitecture() {
    const [openLayer, setOpenLayer] = useState(null);

    return (
        <div className="max-w-5xl mx-auto text-gray-800 pb-10">

            {/* Inject animations */}
            <style>{`
        @keyframes secFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes secPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(79,119,45,0.5); }
          50%      { box-shadow: 0 0 0 8px rgba(79,119,45,0); }
        }
        @keyframes badgeIn {
          from { opacity:0; transform:scale(0.85); }
          to   { opacity:1; transform:scale(1); }
        }
        .sec-layer { animation: secFadeUp 0.5s ease both; }
        .sec-badge { animation: badgeIn 0.4s ease both; }
        .shield-pulse { animation: secPulse 2.4s ease-in-out infinite; }
      `}</style>

            {/* ── Header ── */}
            <div className="mb-8 flex items-start gap-4">
                <div className="shield-pulse flex-shrink-0 w-14 h-14 rounded-2xl bg-[#4F772D] text-white flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-[#4F772D]">
                        AyurSaathi Security Architecture
                    </h2>
                    <p className="mt-1 text-gray-600 leading-relaxed">
                        A <strong>defence-in-depth</strong> security model protecting every layer of the
                        AyurSaathi ecosystem — from user identity and API surfaces to blockchain immutability
                        and regulatory compliance.
                    </p>
                </div>
            </div>

            {/* ── Compliance Badges ── */}
            <div className="flex flex-wrap gap-3 mb-10">
                {complianceBadges.map((b, i) => (
                    <div
                        key={i}
                        className="sec-badge flex items-center gap-2 px-3 py-2 rounded-full border-2 border-[#90A955]/50 bg-[#ECF39E]/60 text-[#31572C]"
                        style={{ animationDelay: `${i * 0.07}s` }}
                    >
                        <CheckCircle2 className="w-4 h-4 text-[#4F772D]" />
                        <span className="text-sm font-semibold">{b.label}</span>
                        <span className="text-xs text-[#4F772D]/70">— {b.sub}</span>
                    </div>
                ))}
            </div>

            {/* ── Defence Layers (accordion) ── */}
            <div className="mb-12">
                <h3 className="text-xl font-bold text-[#31572C] mb-4">Defence Layers</h3>
                <div className="space-y-3">
                    {defenceLayers.map((layer, idx) => {
                        const isOpen = openLayer === idx;
                        return (
                            <div
                                key={idx}
                                className={`sec-layer rounded-2xl border-2 ${layer.border} bg-white overflow-hidden shadow-sm transition-shadow hover:shadow-md`}
                                style={{ animationDelay: `${idx * 0.08}s` }}
                            >
                                {/* Accordion header */}
                                <button
                                    onClick={() => setOpenLayer(isOpen ? null : idx)}
                                    className={`w-full flex items-center justify-between gap-3 px-5 py-3.5 ${layer.color} font-semibold text-base cursor-pointer`}
                                >
                                    <div className="flex items-center gap-3">
                                        {layer.icon}
                                        <span>Layer {idx + 1}: {layer.title}</span>
                                    </div>
                                    <ChevronDown
                                        className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
                                    />
                                </button>

                                {/* Accordion body */}
                                <div
                                    className={`overflow-hidden transition-all duration-400 ease-in-out ${isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}
                                    style={{ transition: "max-height 0.35s ease, opacity 0.3s ease" }}
                                >
                                    <div className="px-5 py-4 grid md:grid-cols-3 gap-4">
                                        {/* Points */}
                                        <div className="md:col-span-2">
                                            <ul className="space-y-2.5">
                                                {layer.points.map((pt, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                        <ChevronRight className="w-4 h-4 text-[#90A955] mt-0.5 flex-shrink-0" />
                                                        <span>{pt}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        {/* Summary callout */}
                                        <div className="flex items-start">
                                            <div className="bg-[#ECF39E]/60 border border-[#90A955]/40 rounded-xl p-3 text-xs text-[#31572C] leading-relaxed">
                                                <span className="font-semibold block mb-1">Why it matters</span>
                                                {layer.summary}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Threat Model ── */}
            <div className="mb-12">
                <h3 className="text-xl font-bold text-[#31572C] mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    Threat Model & Mitigations
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-[#90A955]/30 shadow-sm">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-[#4F772D] text-white">
                                <th className="text-left px-5 py-3 rounded-tl-2xl font-semibold w-1/2">Threat Vector</th>
                                <th className="text-left px-5 py-3 rounded-tr-2xl font-semibold">Mitigation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {threatModel.map((row, i) => (
                                <tr
                                    key={i}
                                    className={`${i % 2 === 0 ? "bg-white" : "bg-[#ECF39E]/30"} border-b border-[#90A955]/15 hover:bg-[#90A955]/10 transition-colors`}
                                >
                                    <td className="px-5 py-3 text-gray-700 font-medium flex items-center gap-2">
                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                                        {row.threat}
                                    </td>
                                    <td className="px-5 py-3 text-[#4F772D] font-medium">
                                        <span className="flex items-center gap-2">
                                            <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                                            {row.mitigation}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Incident Response Flow ── */}
            <div className="mb-12">
                <h3 className="text-xl font-bold text-[#31572C] mb-5 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Incident Response Flow
                </h3>

                <div className="relative pl-6">
                    {/* Vertical rail */}
                    <div
                        className="absolute left-[1.45rem] top-4 bottom-4 w-0.5 rounded-full"
                        style={{ background: "linear-gradient(to bottom, #4F772D, #90A955, #ECF39E)", opacity: 0.4 }}
                    />
                    {incidentSteps.map((s, idx) => (
                        <div
                            key={idx}
                            className="relative flex items-start gap-5 mb-5 last:mb-0 sec-layer"
                            style={{ animationDelay: `${idx * 0.09}s` }}
                        >
                            {/* Dot */}
                            <div className="flex-shrink-0 z-10 w-9 h-9 rounded-full bg-[#4F772D] text-white flex items-center justify-center text-sm font-bold border-2 border-white shield-pulse">
                                {idx + 1}
                            </div>
                            {/* Card */}
                            <div className="flex-1 bg-white border border-[#90A955]/35 rounded-2xl px-5 py-3.5 text-sm text-gray-700 shadow-sm hover:shadow-md hover:translate-x-1 transition-all duration-200 flex items-center gap-3">
                                <ChevronRight className="w-4 h-4 text-[#4F772D] flex-shrink-0" />
                                <span>{s.step}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Key Principle Callout ── */}
            <div className="p-6 bg-[#4F772D] rounded-3xl text-white flex items-start gap-5">
                <KeyRound className="w-10 h-10 flex-shrink-0 opacity-80 mt-1" />
                <div>
                    <h4 className="text-lg font-bold mb-1">Security by Design, Not Afterthought</h4>
                    <p className="text-white/80 text-sm leading-relaxed">
                        AyurSaathi treats security as a first-class architectural concern. Every feature is
                        modelled against a threat matrix before implementation. Encryption, immutability, and
                        audit trails are not add-ons — they are foundational constraints that shape the entire
                        system design, from the farmer's SMS entry point to the consumer's QR scan.
                    </p>
                </div>
            </div>
        </div>
    );
}
