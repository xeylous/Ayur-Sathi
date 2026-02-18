"use client";
import { CheckCircle, ArrowRight, ShieldCheck, Globe, ShoppingCart } from "lucide-react";

export default function ImplementationModel() {
    const phases = [
        {
            title: "Phase 1: Pilot & Foundation",
            description: "Establishing the core herb collection and traceability infrastructure.",
            steps: [
                "Onboarding initial farmer groups and wild collectors.",
                "Deploying geo-tagging and SMS-based data entry systems.",
                "Initializing the blockchain ledger for tamper-proof records.",
            ],
        },
        {
            title: "Phase 2: Regional Integration & Quality Control",
            description: "Expanding to regional hubs and integrating laboratory verification.",
            steps: [
                "Partnering with regional labs for quality and purity certification.",
                "Establishing centralized processing units for bulk handling.",
                "Implementing automated smart contracts for farmer payments.",
            ],
        },
        {
            title: "Phase 3: National Marketplace & Trust",
            description: "Full-scale national launch with direct-to-consumer marketplace.",
            steps: [
                "Opening the AyurSaathi marketplace for verified herb trade.",
                "Integrating QR-based consumer verification for transparency.",
                "Scaling technological infrastructure to support national volume.",
            ],
        },
    ];

    return (
        <div className="max-w-5xl mx-auto text-gray-800">
            <h2 className="text-3xl font-bold text-[#4F772D] mb-4">Implementation Model</h2>
            <p className="text-lg mb-8 text-gray-600">
                Our multi-phased approach ensures a sustainable and scalable rollout of the Ayur-Sathi ecosystem,
                bridging the gap between traditional wisdom and modern technology.
            </p>

            <div className="space-y-8">
                {phases.map((phase, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4 mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{phase.title}</h3>
                                <p className="text-gray-600">{phase.description}</p>
                            </div>
                        </div>

                        <ul className="space-y-3 ml-14">
                            {phase.steps.map((step, sIndex) => (
                                <li key={sIndex} className="flex items-center gap-3">
                                    <ArrowRight className="w-4 h-4 text-[#90A955]" />
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-8 bg-[#90A955]/10 rounded-3xl border border-[#90A955]/20">
                <h3 className="text-2xl font-bold text-[#31572C] mb-4 flex items-center gap-2">
                    <ShoppingCart className="w-6 h-6" />
                    The Final Goal: Marketplace
                </h3>
                <p className="text-[#31572C]/80 leading-relaxed text-lg">
                    The ultimate culmination of our implementation model is a decentralized, transparent, and fair
                    marketplace where farmers receive the true value of their labor, and consumers gain access to
                    certified, authentic Ayurvedic herbs with a single scan.
                </p>
            </div>
        </div>
    );
}
