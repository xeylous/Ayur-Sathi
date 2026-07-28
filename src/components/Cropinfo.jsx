"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Leaf, 
  ShieldCheck, 
  AlertTriangle, 
  Sprout, 
  BookOpen, 
  ChevronRight,
  Info
} from "lucide-react";
import { speciesList } from "../lib/cropdetails";
import { infoList } from "../lib/cropinfo";

const uniqueInfoList = Array.from(
  new Map(infoList.map((item) => [item.speciesId, item])).values()
);

export default function CropDetails() {
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSpecies = useMemo(() => {
    if (!searchQuery.trim()) return speciesList;
    return speciesList.filter((item) => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.speciesId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const selectedData = useMemo(() => {
    return uniqueInfoList.find((item) => item.speciesId === selected) || null;
  }, [selected]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#FDFDF7] via-[#F4F9D8]/30 to-[#FDFDF7] p-4 md:p-8 overflow-hidden font-sans">
      {/* Decorative Blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#90A955]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#ECF39E]/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Header Block */}
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#90A955]/10 border border-[#90A955]/20 text-[#4F772D] text-xs font-semibold uppercase tracking-wider mb-3">
            <Leaf className="w-3.5 h-3.5 animate-pulse" />
            Ayurveda Pharmacopoeia
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#31572C] tracking-tight">
            Herbal Species Directory
          </h1>
          <p className="text-gray-600 mt-2 max-w-xl text-sm md:text-base">
            Explore scientific classifications, therapeutic uses, clinical benefits, and safety considerations for authenticated Ayurvedic medicinal plants.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT PANEL: Species Sidebar */}
          <div className="w-full lg:w-96 flex-shrink-0 bg-white/80 backdrop-blur-md border border-[#90A955]/20 shadow-xl rounded-3xl p-5 flex flex-col h-[500px] lg:h-[calc(100vh-240px)] lg:sticky lg:top-24">
            
            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search species..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#90A955]/30 focus:border-[#4F772D] focus:ring-2 focus:ring-[#90A955]/20 outline-none text-sm text-[#31572C] placeholder-gray-400 transition-all shadow-sm"
              />
            </div>

            {/* Species List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2 hide-scrollbar">
              <AnimatePresence>
                {filteredSpecies.length > 0 ? (
                  filteredSpecies.map((item) => {
                    const isSelected = selected === item.speciesId;
                    const hasInfo = uniqueInfoList.some(info => info.speciesId === item.speciesId);
                    return (
                      <motion.button
                        key={item.speciesId}
                        layoutId={`species-${item.speciesId}`}
                        onClick={() => setSelected(item.speciesId)}
                        className={`w-full text-left p-3 rounded-2xl transition-all duration-200 flex items-center justify-between group relative overflow-hidden cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-r from-[#4F772D] to-[#31572C] text-white shadow-md shadow-[#31572C]/20"
                            : "bg-[#FDFDF7]/60 text-[#31572C] hover:bg-[#90A955]/10 border border-transparent hover:border-[#90A955]/20"
                        }`}
                      >
                        <div className="flex items-center gap-3 relative z-10">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-[#90A955]/10 text-[#4F772D]"
                          }`}>
                            {item.speciesId}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm leading-tight">{item.name}</h4>
                            {!hasInfo && (
                              <span className="text-[10px] text-gray-400 italic">Details coming soon</span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                          isSelected ? "text-white translate-x-0" : "text-[#4F772D] opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                        }`} />
                      </motion.button>
                    );
                  })
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-10 text-gray-400"
                  >
                    <Info className="w-8 h-8 mx-auto mb-2 opacity-50 text-[#90A955]" />
                    <p className="text-sm font-medium">No species match "{searchQuery}"</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT PANEL: Herb Profile details */}
          <div className="flex-grow w-full lg:w-0 min-w-0">
            <AnimatePresence mode="wait">
              {selectedData ? (
                <motion.div
                  key={selectedData.speciesId}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* Hero banner card */}
                  <div className="bg-white/80 backdrop-blur-md border border-[#90A955]/20 shadow-xl rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
                    {selectedData.image && (
                      <div className="relative w-full md:w-56 h-56 flex-shrink-0 rounded-2xl overflow-hidden shadow-md border border-[#90A955]/30 bg-gray-50 group">
                        <img
                          src={selectedData.image}
                          alt={selectedData.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <span className="text-white text-xs font-medium">Authenticated Herb Specimen</span>
                        </div>
                      </div>
                    )}
                    <div className="flex-grow space-y-4 text-center md:text-left w-full">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4F772D]/10 text-[#4F772D] text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4F772D] animate-pulse" />
                        Species Code: {selectedData.speciesId}
                      </div>
                      <h2 className="text-3xl font-extrabold text-[#31572C] leading-tight">
                        {selectedData.name}
                      </h2>
                      <p className="text-sm text-gray-500 italic">
                        Verified botanical classification registered in the Ayur-Sathi network.
                      </p>
                      <div className="h-px bg-gradient-to-r from-[#90A955]/30 to-transparent" />
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <span className="px-3 py-1 bg-[#ECF39E]/30 text-[#31572C] text-xs font-semibold rounded-lg border border-[#ECF39E]/50">
                          Herbaceous
                        </span>
                        <span className="px-3 py-1 bg-[#90A955]/10 text-[#4F772D] text-xs font-semibold rounded-lg border border-[#90A955]/20">
                          Standardized Extracts
                        </span>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200">
                          Quality Certified
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Detail Info Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Uses */}
                    <div className="bg-white/80 border border-[#90A955]/20 rounded-3xl p-6 shadow-md hover:shadow-lg transition-all flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-[#90A955]/10 flex items-center justify-center text-[#4F772D] border border-[#90A955]/20">
                          <Sprout className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-[#31572C]">Traditional Uses</h3>
                      </div>
                      <ul className="space-y-3 flex-grow">
                        {(selectedData.uses || []).map((u, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 leading-relaxed">
                            <span className="w-5 h-5 rounded-full bg-[#ECF39E]/60 flex items-center justify-center flex-shrink-0 text-[#31572C] text-[10px] mt-0.5">
                              ✦
                            </span>
                            <span>{u}</span>
                          </li>
                        ))}
                        {(!selectedData.uses || selectedData.uses.length === 0) && (
                          <li className="text-gray-400 text-sm italic">No documented traditional uses.</li>
                        )}
                      </ul>
                    </div>

                    {/* Benefits */}
                    <div className="bg-white/80 border border-emerald-500/10 rounded-3xl p-6 shadow-md hover:shadow-lg transition-all flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 border border-emerald-500/10">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-emerald-950">Verified Benefits</h3>
                      </div>
                      <ul className="space-y-3 flex-grow">
                        {(selectedData.benefits || []).map((b, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 leading-relaxed">
                            <span className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600 text-xs mt-0.5">
                              ✓
                            </span>
                            <span>{b}</span>
                          </li>
                        ))}
                        {(!selectedData.benefits || selectedData.benefits.length === 0) && (
                          <li className="text-gray-400 text-sm italic">No documented verified benefits.</li>
                        )}
                      </ul>
                    </div>

                    {/* Precautions */}
                    <div className="bg-white/80 border border-amber-500/10 rounded-3xl p-6 shadow-md hover:shadow-lg transition-all flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-500/10">
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-amber-950">Precautions</h3>
                      </div>
                      <ul className="space-y-3 flex-grow">
                        {(selectedData.disadvantages || []).map((d, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 leading-relaxed">
                            <span className="w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 text-amber-600 text-xs mt-0.5">
                              !
                            </span>
                            <span className="text-amber-900/90">{d}</span>
                          </li>
                        ))}
                        {(!selectedData.disadvantages || selectedData.disadvantages.length === 0) && (
                          <li className="text-gray-400 text-sm italic">No documented precautions or side effects.</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center p-10 bg-white/70 backdrop-blur-md border border-[#90A955]/20 shadow-xl rounded-3xl min-h-[500px]"
                >
                  <div className="w-20 h-20 rounded-full bg-[#90A955]/10 flex items-center justify-center text-[#4F772D] mb-6 border border-[#90A955]/20 relative">
                    <BookOpen className="w-10 h-10" />
                    <div className="absolute inset-0 rounded-full border border-[#4F772D] animate-ping opacity-25" />
                  </div>
                  <h3 className="text-xl font-bold text-[#31572C] mb-2">Select a Herb Profile</h3>
                  <p className="text-gray-600 max-w-md text-sm leading-relaxed">
                    Choose an Ayurvedic herbal species from the directory on the left to explore its therapeutic profile, verified benefits, uses, and side effects.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
        </div>
      </div>
    </div>
  );
}
