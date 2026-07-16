"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ShoppingBag, 
  Search, 
  Loader2, 
  MapPin, 
  FileText, 
  QrCode, 
  Calendar, 
  DollarSign, 
  Package, 
  Scale, 
  Tag, 
  ArrowRight,
  User,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Shield,
  Sparkles
} from "lucide-react";
import { speciesList } from "@/lib/cropdetails";

export default function Marketplace() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cardActiveIndexes, setCardActiveIndexes] = useState({});
  const [modalActiveImageIndex, setModalActiveImageIndex] = useState(0);

  useEffect(() => {
    if (selectedProduct) {
      setModalActiveImageIndex(0);
    }
  }, [selectedProduct]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/public/marketplace");
      const data = await res.json();
      if (data.success) {
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch marketplace products:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getHerbName = (speciesId) => {
    const found = speciesList.find(s => s.speciesId === speciesId);
    return found ? found.name : speciesId;
  };

  const filteredProducts = products.filter(item => {
    const herbName = getHerbName(item.speciesId).toLowerCase();
    const batchId = item.batchId.toLowerCase();
    const query = searchTerm.toLowerCase();
    return herbName.includes(query) || batchId.includes(query);
  });

  const downloadFile = (url, filename) => {
    if (!url) return;
    const downloadUrl = url.includes("/upload/")
      ? url.replace("/upload/", "/upload/fl_attachment/")
      : url;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="relative py-12 min-h-screen bg-[#f8fae3]/40">
      {/* Background patterns — warm natural tones */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#90A955]/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ECF39E]/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4F772D]/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#90A955]/15 text-[#4F772D] font-bold text-xs uppercase tracking-wider mb-4 border border-[#90A955]/30">
            <Leaf className="w-4 h-4" />
            Verified Herb Trade
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#31572C] tracking-tight">
            Ayurसाथी Marketplace
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#4F772D]/70">
            Ethically sourced Ayurvedic herbs complete with verified laboratory credentials, manufacturing processing logs, and QR traceability.
          </p>
        </div>

        {/* Toolbar: Search */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative shadow-md rounded-2xl overflow-hidden border border-[#90A955]/25">
            <Search className="absolute left-4 top-3.5 text-[#90A955] w-5 h-5" />
            <input
              type="text"
              placeholder="Search marketplace by herb name or batch ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border-0 outline-none text-sm focus:ring-2 focus:ring-[#90A955] text-[#31572C] placeholder-[#90A955]/50"
            />
          </div>
        </div>

        {/* Grid Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#4F772D]">
            <Loader2 className="w-10 h-10 animate-spin mb-3" />
            <span className="font-semibold text-sm">Loading listed herbs...</span>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((item) => {
              const itemImages = item.marketplaceImages && item.marketplaceImages.length > 0
                ? item.marketplaceImages
                : item.marketplaceImage?.url
                  ? [item.marketplaceImage]
                  : [];
              return (
                <div 
                  key={item.batchId}
                  className="bg-white border border-[#90A955]/20 rounded-2xl overflow-hidden flex flex-col hover:shadow-xl hover:shadow-[#90A955]/10 hover:border-[#90A955]/40 transition-all duration-300 h-[490px] p-4 group"
                >
                  {/* Product Image Area */}
                  <div 
                    onClick={() => router.push("/marketplace/" + item.batchId)}
                    className="relative h-[220px] bg-[#f8fae3]/50 rounded-xl overflow-hidden flex items-center justify-center border border-[#ECF39E]/60 mb-3 group/card cursor-pointer"
                  >
                    {itemImages.length > 0 ? (
                      <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
                        <img 
                          src={itemImages[cardActiveIndexes[item.batchId] || 0]?.url} 
                          alt="Backdrop" 
                          className="absolute inset-0 w-full h-full object-cover blur-sm opacity-20 scale-110"
                        />
                        <img 
                          src={itemImages[cardActiveIndexes[item.batchId] || 0]?.url} 
                          alt="Product" 
                          className="relative z-10 max-w-full max-h-full object-contain p-1 transition-all duration-500 group-hover/card:scale-103"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#31572C] to-[#4F772D] text-[#ECF39E]">
                        <ShoppingBag size={48} className="opacity-40 mb-2" />
                        <span className="text-xs font-semibold">No product photo</span>
                      </div>
                    )}

                    {/* Badges on top of image */}
                    <span className="bg-gradient-to-r from-[#4F772D] to-[#31572C] text-white text-[9px] font-black px-2.5 py-1 absolute top-3 left-3 rounded-md z-10 shadow-sm uppercase tracking-wider flex items-center gap-1">
                      <Sparkles size={10} />
                      Ayur Choice
                    </span>
                    <span className="bg-[#31572C]/85 backdrop-blur text-[#ECF39E] text-[9px] font-mono font-bold px-2 py-1 rounded-md absolute top-3 right-3 z-10 shadow-sm">
                      #{item.batchId}
                    </span>

                    {/* Left/Right controls on card */}
                    {itemImages.length > 1 && (
                      <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between z-20">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const len = itemImages.length;
                            const currentIdx = cardActiveIndexes[item.batchId] || 0;
                            const nextIdx = currentIdx === 0 ? len - 1 : currentIdx - 1;
                            setCardActiveIndexes(prev => ({ ...prev, [item.batchId]: nextIdx }));
                          }}
                          className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-[#31572C] flex items-center justify-center shadow-lg transition-colors cursor-pointer border border-[#90A955]/30"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const len = itemImages.length;
                            const currentIdx = cardActiveIndexes[item.batchId] || 0;
                            const nextIdx = currentIdx === len - 1 ? 0 : currentIdx + 1;
                            setCardActiveIndexes(prev => ({ ...prev, [item.batchId]: nextIdx }));
                          }}
                          className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-[#31572C] flex items-center justify-center shadow-lg transition-colors cursor-pointer border border-[#90A955]/30"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    )}

                    {/* Dot indicators in card visual area */}
                    {itemImages.length > 1 && (
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1 bg-[#31572C]/50 px-2 py-1 rounded-full backdrop-blur-sm">
                        {itemImages.map((_, idx) => (
                          <span 
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                              idx === (cardActiveIndexes[item.batchId] || 0) ? "bg-[#ECF39E] scale-125" : "bg-white/40"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                </div>

                {/* Product Card Text Area */}
                <div className="flex-grow flex flex-col justify-between px-1">
                  <div>
                    {/* Category & Species */}
                    <span className="text-[10px] text-[#4F772D]/60 uppercase tracking-widest block font-bold">
                      Category: {item.speciesId} Herb
                    </span>

                    {/* Product Title */}
                    <h3 
                      onClick={() => router.push("/marketplace/" + item.batchId)}
                      className="text-sm font-bold text-[#31572C] leading-snug line-clamp-2 h-10 mt-0.5 hover:text-[#4F772D] transition-colors cursor-pointer"
                    >
                      {getHerbName(item.speciesId)} (Traceable Natural Harvest Batch)
                    </h3>

                    {/* Ratings */}
                    <div className="flex items-center gap-0.5 text-amber-500 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                      <span className="text-xs text-[#31572C] hover:text-[#4F772D] hover:underline font-semibold ml-1.5 cursor-pointer">
                        4.8 ({120 + (item.marketplaceQuantity % 30)} reviews)
                      </span>
                    </div>

                    {/* Price block */}
                    <div className="flex items-baseline gap-2 mt-1.5">
                      <span className="text-2xl font-extrabold text-[#31572C]">
                        ₹{item.marketplacePrice}
                      </span>
                      <span className="text-xs text-gray-500 line-through">
                        ₹{Math.round(item.marketplacePrice * 1.25)}
                      </span>
                      <span className="text-xs text-[#4F772D] font-bold">
                        (20% off)
                      </span>
                    </div>

                    {/* Delivery & Stock status */}
                    <span className="text-xs text-[#4F772D] font-bold block mt-1">
                      In Stock ({item.marketplaceQuantity} left)
                    </span>
                    
                    <span className="text-[11px] text-[#4F772D]/50 block">
                      Size: {item.marketplaceWeightGm}g • Pack of 1
                    </span>
                  </div>

                  {/* CTA button */}
                  <div className="pt-3">
                    <button
                      onClick={() => router.push("/marketplace/" + item.batchId)}
                      className="w-full bg-gradient-to-r from-[#4F772D] to-[#31572C] hover:from-[#31572C] hover:to-[#4F772D] text-white font-bold text-xs py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-[#4F772D]/20 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      View Details
                      <ArrowRight size={13} className="text-[#ECF39E]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        ) : (
          <div className="bg-white max-w-md mx-auto p-10 rounded-3xl border border-[#90A955]/20 shadow-md text-center">
            <ShoppingBag className="w-12 h-12 text-[#90A955] mx-auto mb-3 opacity-40" />
            <h4 className="text-lg font-bold text-[#31572C] mb-1">No products found</h4>
            <p className="text-xs text-[#4F772D]/60">
              {searchTerm 
                ? "Try searching for a different keyword or batch ID."
                : "No manufactured products have been listed on the marketplace yet."}
            </p>
          </div>
        )}

        {/* Traceability Details Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/65 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-250">
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-500 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer text-sm font-bold shadow-sm z-30"
                onClick={() => setSelectedProduct(null)}
              >
                ✕
              </button>

              {/* Product Page Columns */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
                
                {/* COLUMN 1: Image Gallery (Span 5) */}
                <div className="md:col-span-5">
                  {/* Big Active Image Box */}
                  <div className="w-full aspect-square bg-[#f8fae3]/40 border border-[#ECF39E]/60 rounded-xl overflow-hidden flex items-center justify-center relative shadow-inner">
                    {selectedProduct.marketplaceImages && selectedProduct.marketplaceImages.length > 0 ? (
                      <img 
                        src={selectedProduct.marketplaceImages[modalActiveImageIndex]?.url || selectedProduct.marketplaceImages[0].url} 
                        alt="Product Primary" 
                        className="w-full h-full object-contain p-2"
                      />
                    ) : selectedProduct.marketplaceImage?.url ? (
                      <img 
                        src={selectedProduct.marketplaceImage.url} 
                        alt="Product Primary" 
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="text-[#90A955] text-xs">No image available</div>
                    )}
                  </div>
                </div>

                {/* COLUMN 2: Product Specifications & Info (Span 4) */}
                <div className="md:col-span-4 space-y-4">
                  {/* Brand Link */}
                  <div>
                    <span className="text-xs text-[#4F772D] hover:underline hover:text-[#31572C] cursor-pointer font-bold">
                      Visit the Ayur-Saathi Store
                    </span>
                    <h2 className="text-xl font-bold text-[#31572C] leading-snug mt-1">
                      {getHerbName(selectedProduct.speciesId)} (Pure Traceable Batch)
                    </h2>
                    <p className="text-xs text-[#4F772D]/50 font-mono mt-0.5">Batch ID: #{selectedProduct.batchId}</p>
                  </div>

                  {/* Ratings */}
                  <div className="flex items-center gap-1 border-b border-[#ECF39E]/50 pb-3">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-[#4F772D] ml-2 hover:underline hover:text-[#31572C] cursor-pointer">
                      4.8 (142 ratings)
                    </span>
                  </div>

                  {/* Price Info */}
                  <div className="border-b border-[#ECF39E]/50 pb-3 space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[#4F772D] text-2xl font-light font-sans">-20%</span>
                      <span className="text-3xl font-extrabold text-[#31572C]">₹{selectedProduct.marketplacePrice}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      M.R.P.: <span className="line-through">₹{Math.round(selectedProduct.marketplacePrice * 1.25)}</span>
                    </div>
                    <span className="text-xs text-[#4F772D]/60 block">Inclusive of all taxes</span>
                  </div>

                  {/* Product Specification Details */}
                  <div className="grid grid-cols-2 gap-y-2 text-xs border-b border-[#ECF39E]/50 pb-3">
                    <span className="font-bold text-[#4F772D]/60">Herb Species:</span>
                    <span className="text-[#31572C] font-semibold">{selectedProduct.speciesId}</span>

                    <span className="font-bold text-[#4F772D]/60">Net Weight:</span>
                    <span className="text-[#31572C] font-semibold">{selectedProduct.marketplaceWeightGm} Grams</span>

                    <span className="font-bold text-[#4F772D]/60">Harvest Date:</span>
                    <span className="text-[#31572C] font-semibold">
                      {selectedProduct.timestamp ? new Date(selectedProduct.timestamp).toLocaleDateString() : "N/A"}
                    </span>

                    <span className="font-bold text-[#4F772D]/60">Expiry Date:</span>
                    <span className="text-[#31572C] font-semibold">
                      {selectedProduct.productExpiryDate ? new Date(selectedProduct.productExpiryDate).toLocaleDateString() : "N/A"}
                    </span>
                  </div>

                  {/* About This Item Bullet list */}
                  <div className="text-xs text-[#31572C]/80">
                    <h4 className="font-bold text-[#31572C] text-sm mb-1.5">About this item</h4>
                    <ul className="list-disc pl-4 space-y-2 leading-relaxed">
                      <li><strong>Natural Heritage:</strong> Premium quality {getHerbName(selectedProduct.speciesId)} harvested from pesticide-free agricultural sites.</li>
                      <li><strong>Verified Quality Checks:</strong> Fully screened and approved by laboratory checks showing standard moisture, purity, and organic content.</li>
                      <li><strong>Blockchain Traceable:</strong> Includes a cryptographic QR log to trace step-by-step from farming, laboratory, and factory.</li>
                      <li><strong>Safety & Usage:</strong> {selectedProduct.marketplaceDetails || "For pharmaceutical, organic wellness extracts, or dietary supplement use."}</li>
                    </ul>
                  </div>
                </div>

                {/* COLUMN 3: Buy Box (Span 3) */}
                <div className="md:col-span-3 bg-[#f8fae3]/40 border border-[#90A955]/20 rounded-xl p-5 space-y-4 shadow-sm self-start">
                  <div>
                    <span className="text-2xl font-extrabold text-[#31572C]">₹{selectedProduct.marketplacePrice}</span>
                    <span className="text-xs text-[#4F772D]/60 block mt-1">
                      FREE delivery <strong>Wednesday, Oct 15</strong>.
                    </span>
                  </div>

                  {/* Stock Level */}
                  <div>
                    {selectedProduct.marketplaceQuantity > 10 ? (
                      <span className="text-[#4F772D] font-bold text-sm block">In Stock</span>
                    ) : (
                      <span className="text-orange-700 font-bold text-sm block">
                        Only {selectedProduct.marketplaceQuantity} left in stock - order soon
                      </span>
                    )}
                    <span className="text-xs text-[#4F772D]/50 mt-1 block">Sold by Ayur-Saathi & Fulfilled by Store</span>
                  </div>

                  {/* Actions buttons */}
                  <div className="space-y-2 pt-2">
                    <button className="w-full bg-[#ECF39E] hover:bg-[#dce88a] text-[#31572C] border border-[#90A955]/30 font-bold text-xs py-3 rounded-2xl transition-all shadow-sm cursor-pointer">
                      Add to Cart
                    </button>
                    <button className="w-full bg-gradient-to-r from-[#4F772D] to-[#31572C] hover:from-[#31572C] hover:to-[#4F772D] text-white border border-[#31572C] font-bold text-xs py-3 rounded-2xl transition-all shadow-sm cursor-pointer">
                      Buy Now
                    </button>
                  </div>

                  {/* Trust Badge */}
                  <div className="border-t border-[#90A955]/20 pt-3 flex items-center gap-2.5 text-xs text-[#4F772D]/60">
                    <Shield className="w-5 h-5 text-[#90A955]" />
                    <span>Secure transaction</span>
                  </div>

                  {/* QR Box in Right Column */}
                  {selectedProduct.qrCode?.url && (
                    <div className="border-t border-[#90A955]/20 pt-4 space-y-2">
                      <span className="block text-[10px] text-[#4F772D]/50 font-bold uppercase tracking-wider">
                        Supply Chain Trace QR
                      </span>
                      <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-[#ECF39E]/60">
                        <img 
                          src={selectedProduct.qrCode.url} 
                          alt="QR code" 
                          className="w-12 h-12 border border-[#ECF39E] bg-white p-0.5 rounded-lg"
                        />
                        <button
                          onClick={() => downloadFile(selectedProduct.qrCode.url, `${selectedProduct.batchId}_QR.png`)}
                          className="text-[10px] font-bold bg-[#31572C] hover:bg-[#4F772D] text-white px-2 py-1.5 rounded-lg transition-colors cursor-pointer shadow-sm"
                        >
                          Get QR Code
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* End-to-End Blockchain Traceability Separator */}
              <div className="mt-12 border-t border-[#ECF39E]/50 pt-8">
                <div className="bg-[#f8fae3]/50 p-5 rounded-2xl border border-[#90A955]/15 mb-6">
                  <h4 className="font-extrabold text-[#31572C] text-lg mb-1">
                    Trace & Verify Product Authenticity
                  </h4>
                  <p className="text-xs text-[#4F772D]/60">
                    This product is fully integrated with Ayur-Sathi blockchain logs. Verify the end-to-end supply chain steps below.
                  </p>
                </div>

                <div className="space-y-8 relative pl-6 border-l-2 border-[#90A955]/30 ml-3">
                  
                  {/* Step 1: Farm Origin */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 bg-[#90A955] w-4 h-4 rounded-full border-4 border-white shadow" />
                    <div className="bg-[#f8fae3]/50 p-4 rounded-2xl border border-[#90A955]/15">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-[#4F772D] uppercase tracking-wider">Step 1: Farm Cultivation & Upload</span>
                        <span className="text-[10px] text-[#4F772D]/40 font-mono">Farmer ID: {selectedProduct.uniqueId}</span>
                      </div>
                      <div className="text-xs text-[#31572C]/70 grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-[#90A955]" />
                          <span>GPS: {selectedProduct.gpsCoordinates?.latitude?.toFixed(4)}°, {selectedProduct.gpsCoordinates?.longitude?.toFixed(4)}°</span>
                        </div>
                        <div>
                          <span className="font-semibold text-[#4F772D]/50">Uploaded On: </span>
                          {selectedProduct.timestamp ? new Date(selectedProduct.timestamp).toLocaleDateString() : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Quality Lab Assurance */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 bg-[#4F772D] w-4 h-4 rounded-full border-4 border-white shadow" />
                    <div className="bg-[#4F772D]/5 p-4 rounded-2xl border border-[#4F772D]/10">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-[#4F772D] uppercase tracking-wider">Step 2: Lab Analysis & QA Approved</span>
                        <span className="text-[10px] text-[#4F772D]/40 font-mono">Lab ID: {selectedProduct.acceptedBy || "N/A"}</span>
                      </div>
                      {selectedProduct.tests && Object.keys(selectedProduct.tests).length > 0 && (
                        <div className="mt-2 text-xs flex gap-2 flex-wrap">
                          {Object.entries(selectedProduct.tests).map(([test, val]) => (
                            <span key={test} className="bg-[#ECF39E]/40 text-[#31572C] px-2 py-0.5 rounded font-mono font-bold text-[10px] border border-[#90A955]/20 uppercase">
                              {test}: {String(val)}
                            </span>
                          ))}
                        </div>
                      )}
                      {selectedProduct.certificate?.url && (
                        <div className="mt-3 flex justify-between items-center bg-white p-2.5 rounded-xl border border-[#ECF39E]/40">
                          <span className="text-xs text-[#4F772D]/60 font-semibold flex items-center gap-1.5">
                            <FileText size={14} className="text-[#4F772D]" /> Quality Certificate (PDF)
                          </span>
                          <div className="flex gap-3">
                            <button
                              onClick={() => window.open(selectedProduct.certificate.url, "_blank")}
                              className="text-[10px] font-bold text-[#4F772D] hover:text-[#31572C] hover:underline inline-flex items-center gap-1 cursor-pointer"
                            >
                              View <ExternalLink size={10} />
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={() => downloadFile(selectedProduct.certificate.url, `${selectedProduct.batchId}_certificate.pdf`)}
                              className="text-[10px] font-bold text-[#31572C] hover:text-[#4F772D] hover:underline inline-flex items-center gap-1 cursor-pointer"
                            >
                              Download
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step 3: Manufacturing & Processing */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 bg-[#31572C] w-4 h-4 rounded-full border-4 border-white shadow" />
                    <div className="bg-[#31572C]/5 p-4 rounded-2xl border border-[#31572C]/10">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-[#31572C] uppercase tracking-wider">Step 3: Manufacturing & QR Generation</span>
                        <span className="text-[10px] text-[#4F772D]/40 font-mono">Factory ID: {selectedProduct.acceptedByManu || "N/A"}</span>
                      </div>
                      <div className="text-xs text-[#31572C]/70 mt-2 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <User size={14} className="text-[#90A955]" />
                          <span>Operator: {selectedProduct.manuOperatorName || "N/A"}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-[#4F772D]/50">Manufactured On: </span>
                          {selectedProduct.manufacturedAt ? new Date(selectedProduct.manufacturedAt).toLocaleString() : "N/A"}
                        </div>
                      </div>

                      {selectedProduct.manufacturingProcesses?.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-[#31572C]/10 space-y-3">
                          <span className="block text-xs font-semibold text-[#31572C] uppercase tracking-wider">
                            Processing Timeline Details:
                          </span>
                          <div className="relative pl-4 border-l border-[#90A955]/30 ml-1.5 space-y-4">
                            {selectedProduct.manufacturingProcesses.map((step, i) => (
                              <div key={i} className="relative">
                                <div className="absolute -left-[21px] top-1 bg-[#90A955] w-2 h-2 rounded-full border-2 border-white shadow" />
                                <div className="text-xs">
                                  <div className="flex justify-between font-semibold text-[#31572C]">
                                    <span>{step.processName}</span>
                                    <span className="text-[10px] text-[#4F772D]/40 font-mono">
                                      {step.date ? new Date(step.date).toLocaleDateString() : ""}
                                    </span>
                                  </div>
                                  {step.notes && <p className="text-[11px] text-[#4F772D]/50 italic mt-0.5">"{step.notes}"</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
