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
  ExternalLink
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
    <section className="relative py-12 min-h-screen bg-gray-50/50">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-100/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#90A955]/15 text-[#4F772D] font-bold text-xs uppercase tracking-wider mb-4 border border-[#90A955]/30">
            <ShoppingBag className="w-4 h-4" />
            Verified Herb Trade
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-indigo-950 tracking-tight">
            Ayurसाथी Marketplace
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-500">
            Ethically sourced Ayurvedic herbs complete with verified laboratory credentials, manufacturing processing logs, and QR traceability.
          </p>
        </div>

        {/* Toolbar: Search */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative shadow-md rounded-2xl overflow-hidden">
            <Search className="absolute left-4 top-3.5 text-indigo-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search marketplace by herb name or batch ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border-0 outline-none text-sm focus:ring-2 focus:ring-[#90A955]"
            />
          </div>
        </div>

        {/* Grid Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-indigo-600">
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
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col hover:shadow-lg transition-all h-[580px] p-4 bg-white"
                >
                  {/* Product Image Area (occupies ~55% height) */}
                  <div 
                    onClick={() => router.push("/marketplace/" + item.batchId)}
                    className="relative h-[310px] bg-gray-50/50 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100/60 mb-3 group/card cursor-pointer"
                  >
                    {itemImages.length > 0 ? (
                      <img 
                        src={itemImages[cardActiveIndexes[item.batchId] || 0]?.url} 
                        alt="Product" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-950 text-indigo-200">
                        <ShoppingBag size={48} className="opacity-40 mb-2" />
                        <span className="text-xs font-semibold">No product photo</span>
                      </div>
                    )}

                    {/* Badges on top of image */}
                    <span className="bg-[#4F772D] text-white text-[9px] font-black px-2.5 py-1 absolute top-3 left-3 rounded-md z-10 shadow-sm uppercase tracking-wider">
                      Ayur Choice
                    </span>
                    <span className="bg-gray-800/85 backdrop-blur text-white text-[9px] font-mono font-bold px-2 py-1 rounded-md absolute top-3 right-3 z-10 shadow-sm">
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
                          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-800 text-xs flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                        >
                          ◀
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
                          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-800 text-xs flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                        >
                          ▶
                        </button>
                      </div>
                    )}

                    {/* Dot indicators in card visual area */}
                    {itemImages.length > 1 && (
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1 bg-black/35 px-2 py-1 rounded-full backdrop-blur-sm">
                        {itemImages.map((_, idx) => (
                          <span 
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                              idx === (cardActiveIndexes[item.batchId] || 0) ? "bg-white scale-125" : "bg-white/40"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                </div>

                {/* Amazon Product Card Text Area (occupies ~45% height) */}
                <div className="flex-grow flex flex-col justify-between px-1">
                  <div>
                    {/* Category & Species */}
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-bold">
                      Category: {item.speciesId} Herb
                    </span>

                    {/* Product Title */}
                    <h3 
                      onClick={() => router.push("/marketplace/" + item.batchId)}
                      className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 h-10 mt-0.5 hover:text-orange-700 transition-colors cursor-pointer"
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
                      <span className="text-xs text-indigo-900 hover:text-[#4F772D] hover:underline font-semibold ml-1.5 cursor-pointer">
                        4.8 ({120 + (item.marketplaceQuantity % 30)} reviews)
                      </span>
                    </div>

                    {/* Price block */}
                    <div className="flex items-baseline gap-2 mt-1.5">
                      <span className="text-2xl font-extrabold text-gray-900">
                        ₹{item.marketplacePrice}
                      </span>
                      <span className="text-xs text-gray-500 line-through">
                        ₹{Math.round(item.marketplacePrice * 1.25)}
                      </span>
                      <span className="text-xs text-green-700 font-bold">
                        (20% off)
                      </span>
                    </div>

                    {/* Delivery & Stock status */}
                    <span className="text-xs text-green-700 font-bold block mt-1">
                      In Stock ({item.marketplaceQuantity} left)
                    </span>
                    
                    <span className="text-[11px] text-gray-500 block">
                      Size: {item.marketplaceWeightGm}g • Pack of 1
                    </span>
                  </div>

                  {/* Amazon golden button */}
                  <div className="pt-3">
                    <button
                      onClick={() => router.push("/marketplace/" + item.batchId)}
                      className="w-full bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      View Traceability & Details
                      <ArrowRight size={13} className="text-indigo-200" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        ) : (
          <div className="bg-white max-w-md mx-auto p-10 rounded-3xl border border-gray-100 shadow-md text-center">
            <ShoppingBag className="w-12 h-12 text-[#90A955] mx-auto mb-3 opacity-40" />
            <h4 className="text-lg font-bold text-indigo-950 mb-1">No products found</h4>
            <p className="text-xs text-gray-500">
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
                className="absolute top-4 right-4 bg-gray-150 hover:bg-red-50 hover:text-red-655 text-gray-500 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer text-sm font-bold shadow-sm z-30"
                onClick={() => setSelectedProduct(null)}
              >
                ✕
              </button>

              {/* Amazon Product Page Columns */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
                
                {/* COLUMN 1: Image Gallery (Span 5) */}
                <div className="md:col-span-5 flex flex-col sm:flex-row-reverse gap-4">
                  {/* Big Active Image Box */}
                  <div className="flex-grow aspect-square bg-[#F7F7F7] border border-gray-100 rounded-xl overflow-hidden flex items-center justify-center relative shadow-inner">
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
                      <div className="text-gray-400 text-xs">No image available</div>
                    )}
                  </div>

                  {/* Thumbnail Selector Column */}
                  {selectedProduct.marketplaceImages && selectedProduct.marketplaceImages.length > 0 && (
                    <div className="flex sm:flex-col gap-2 flex-wrap items-center justify-start overflow-y-auto max-h-[400px]">
                      {selectedProduct.marketplaceImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setModalActiveImageIndex(idx)}
                          className={`w-14 h-14 rounded-lg overflow-hidden border-2 bg-white transition-all cursor-pointer ${
                            idx === modalActiveImageIndex ? "border-[#E47911] shadow-sm" : "border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* COLUMN 2: Product Specifications & Info (Span 4) */}
                <div className="md:col-span-4 space-y-4">
                  {/* Brand Link */}
                  <div>
                    <span className="text-xs text-blue-650 hover:underline hover:text-orange-705 cursor-pointer font-bold">
                      Visit the Ayur-Saathi Store
                    </span>
                    <h2 className="text-xl font-bold text-gray-900 leading-snug mt-1">
                      {getHerbName(selectedProduct.speciesId)} (Pure Traceable Batch)
                    </h2>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">Batch ID: #{selectedProduct.batchId}</p>
                  </div>

                  {/* Ratings */}
                  <div className="flex items-center gap-1 border-b border-gray-100 pb-3">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-blue-650 ml-2 hover:underline hover:text-orange-705 cursor-pointer">
                      4.8 (142 ratings)
                    </span>
                  </div>

                  {/* Price Info */}
                  <div className="border-b border-gray-100 pb-3 space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-red-700 text-2xl font-light font-sans">-20%</span>
                      <span className="text-3xl font-extrabold text-gray-900">₹{selectedProduct.marketplacePrice}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      M.R.P.: <span className="line-through">₹{Math.round(selectedProduct.marketplacePrice * 1.25)}</span>
                    </div>
                    <span className="text-xs text-gray-600 block">Inclusive of all taxes</span>
                  </div>

                  {/* Product Specification Details */}
                  <div className="grid grid-cols-2 gap-y-2 text-xs border-b border-gray-100 pb-3">
                    <span className="font-bold text-gray-500">Herb Species:</span>
                    <span className="text-gray-800 font-semibold">{selectedProduct.speciesId}</span>

                    <span className="font-bold text-gray-500">Net Weight:</span>
                    <span className="text-gray-800 font-semibold">{selectedProduct.marketplaceWeightGm} Grams</span>

                    <span className="font-bold text-gray-500">Harvest Date:</span>
                    <span className="text-gray-800 font-semibold">
                      {selectedProduct.timestamp ? new Date(selectedProduct.timestamp).toLocaleDateString() : "N/A"}
                    </span>

                    <span className="font-bold text-gray-500">Expiry Date:</span>
                    <span className="text-gray-800 font-semibold">
                      {selectedProduct.productExpiryDate ? new Date(selectedProduct.productExpiryDate).toLocaleDateString() : "N/A"}
                    </span>
                  </div>

                  {/* About This Item Bullet list */}
                  <div className="text-xs text-gray-700">
                    <h4 className="font-bold text-gray-900 text-sm mb-1.5">About this item</h4>
                    <ul className="list-disc pl-4 space-y-2 leading-relaxed">
                      <li><strong>Natural Heritage:</strong> Premium quality {getHerbName(selectedProduct.speciesId)} harvested from pesticide-free agricultural sites.</li>
                      <li><strong>Verified Quality Checks:</strong> Fully screened and approved by laboratory checks showing standard moisture, purity, and organic content.</li>
                      <li><strong>Blockchain Traceable:</strong> Includes a cryptographic QR log to trace step-by-step from farming, laboratory, and factory.</li>
                      <li><strong>Safety & Usage:</strong> {selectedProduct.marketplaceDetails || "For pharmaceutical, organic wellness extracts, or dietary supplement use."}</li>
                    </ul>
                  </div>
                </div>

                {/* COLUMN 3: Amazon Buy Box (Span 3) */}
                <div className="md:col-span-3 bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm self-start">
                  <div>
                    <span className="text-2xl font-extrabold text-gray-900">₹{selectedProduct.marketplacePrice}</span>
                    <span className="text-xs text-gray-500 block mt-1">
                      FREE delivery <strong>Wednesday, Oct 15</strong>.
                    </span>
                  </div>

                  {/* Stock Level */}
                  <div>
                    {selectedProduct.marketplaceQuantity > 10 ? (
                      <span className="text-green-700 font-bold text-sm block">In Stock</span>
                    ) : (
                      <span className="text-orange-700 font-bold text-sm block">
                        Only {selectedProduct.marketplaceQuantity} left in stock - order soon
                      </span>
                    )}
                    <span className="text-xs text-gray-500 mt-1 block">Sold by Ayur-Saathi & Fulfilled by Store</span>
                  </div>

                  {/* Actions buttons */}
                  <div className="space-y-2 pt-2">
                    <button className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 border border-[#FCD200] font-bold text-xs py-3 rounded-2xl transition-all shadow-sm cursor-pointer">
                      Add to Cart
                    </button>
                    <button className="w-full bg-[#FA8900] hover:bg-[#E47911] text-white border border-[#E47911] font-bold text-xs py-3 rounded-2xl transition-all shadow-sm cursor-pointer">
                      Buy Now
                    </button>
                  </div>

                  {/* Trust Badge */}
                  <div className="border-t pt-3 flex items-center gap-2.5 text-xs text-gray-500">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secure transaction</span>
                  </div>

                  {/* QR Box in Right Column */}
                  {selectedProduct.qrCode?.url && (
                    <div className="border-t pt-4 space-y-2">
                      <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        Supply Chain Trace QR
                      </span>
                      <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-100">
                        <img 
                          src={selectedProduct.qrCode.url} 
                          alt="QR code" 
                          className="w-12 h-12 border bg-white p-0.5 rounded-lg"
                        />
                        <button
                          onClick={() => downloadFile(selectedProduct.qrCode.url, `${selectedProduct.batchId}_QR.png`)}
                          className="text-[10px] font-bold bg-indigo-900 hover:bg-indigo-950 text-white px-2 py-1.5 rounded-lg transition-colors cursor-pointer shadow-sm"
                        >
                          Get QR Code
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* End-to-End Blockchain Traceability Separator */}
              <div className="mt-12 border-t pt-8">
                <div className="bg-indigo-50/20 p-5 rounded-2xl border border-indigo-50/40 mb-6">
                  <h4 className="font-extrabold text-[#111] text-lg mb-1">
                    Trace & Verify Product Authenticity
                  </h4>
                  <p className="text-xs text-gray-500">
                    This product is fully integrated with Ayur-Sathi blockchain logs. Verify the end-to-end supply chain steps below.
                  </p>
                </div>

                <div className="space-y-8 relative pl-6 border-l-2 border-green-200 ml-3">
                  
                  {/* Step 1: Farm Origin */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 bg-[#90A955] w-4 h-4 rounded-full border-4 border-white shadow" />
                    <div className="bg-green-50/40 p-4 rounded-2xl border border-green-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-green-800 uppercase tracking-wider">Step 1: Farm Cultivation & Upload</span>
                        <span className="text-[10px] text-gray-400 font-mono">Farmer ID: {selectedProduct.uniqueId}</span>
                      </div>
                      <div className="text-xs text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-gray-400" />
                          <span>GPS: {selectedProduct.gpsCoordinates?.latitude?.toFixed(4)}°, {selectedProduct.gpsCoordinates?.longitude?.toFixed(4)}°</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-500">Uploaded On: </span>
                          {selectedProduct.timestamp ? new Date(selectedProduct.timestamp).toLocaleDateString() : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Quality Lab Assurance */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 bg-blue-500 w-4 h-4 rounded-full border-4 border-white shadow" />
                    <div className="bg-blue-50/30 p-4 rounded-2xl border border-blue-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-blue-800 uppercase tracking-wider">Step 2: Lab Analysis & QA Approved</span>
                        <span className="text-[10px] text-gray-400 font-mono">Lab ID: {selectedProduct.acceptedBy || "N/A"}</span>
                      </div>
                      {selectedProduct.tests && Object.keys(selectedProduct.tests).length > 0 && (
                        <div className="mt-2 text-xs flex gap-2 flex-wrap">
                          {Object.entries(selectedProduct.tests).map(([test, val]) => (
                            <span key={test} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono font-bold text-[10px] border border-blue-100 uppercase">
                              {test}: {String(val)}
                            </span>
                          ))}
                        </div>
                      )}
                      {selectedProduct.certificate?.url && (
                        <div className="mt-3 flex justify-between items-center bg-white p-2.5 rounded-xl border border-blue-50">
                          <span className="text-xs text-gray-500 font-semibold flex items-center gap-1.5">
                            <FileText size={14} className="text-blue-500" /> Quality Certificate (PDF)
                          </span>
                          <div className="flex gap-3">
                            <button
                              onClick={() => window.open(selectedProduct.certificate.url, "_blank")}
                              className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
                            >
                              View <ExternalLink size={10} />
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={() => downloadFile(selectedProduct.certificate.url, `${selectedProduct.batchId}_certificate.pdf`)}
                              className="text-[10px] font-bold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
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
                    <div className="absolute -left-[31px] top-1.5 bg-indigo-600 w-4 h-4 rounded-full border-4 border-white shadow" />
                    <div className="bg-indigo-50/30 p-4 rounded-2xl border border-indigo-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-indigo-800 uppercase tracking-wider">Step 3: Manufacturing & QR Generation</span>
                        <span className="text-[10px] text-gray-400 font-mono">Factory ID: {selectedProduct.acceptedByManu || "N/A"}</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-2 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <User size={14} className="text-gray-400" />
                          <span>Operator: {selectedProduct.manuOperatorName || "N/A"}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-500">Manufactured On: </span>
                          {selectedProduct.manufacturedAt ? new Date(selectedProduct.manufacturedAt).toLocaleString() : "N/A"}
                        </div>
                      </div>

                      {selectedProduct.manufacturingProcesses?.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-indigo-100 space-y-3">
                          <span className="block text-xs font-semibold text-indigo-955 uppercase tracking-wider">
                            Processing Timeline Details:
                          </span>
                          <div className="relative pl-4 border-l border-indigo-200 ml-1.5 space-y-4">
                            {selectedProduct.manufacturingProcesses.map((step, i) => (
                              <div key={i} className="relative">
                                <div className="absolute -left-[21px] top-1 bg-indigo-400 w-2 h-2 rounded-full border-2 border-white shadow" />
                                <div className="text-xs">
                                  <div className="flex justify-between font-semibold text-gray-800">
                                    <span>{step.processName}</span>
                                    <span className="text-[10px] text-gray-400 font-mono">
                                      {step.date ? new Date(step.date).toLocaleDateString() : ""}
                                    </span>
                                  </div>
                                  {step.notes && <p className="text-[11px] text-gray-500 italic mt-0.5">"{step.notes}"</p>}
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
