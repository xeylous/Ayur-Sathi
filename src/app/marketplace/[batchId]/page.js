"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  ShoppingBag, 
  Loader2, 
  MapPin, 
  FileText, 
  QrCode, 
  ExternalLink,
  User,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Shield,
  Leaf
} from "lucide-react";
import { speciesList } from "@/lib/cropdetails";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const batchId = params?.batchId;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalActiveImageIndex, setModalActiveImageIndex] = useState(0);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const fetchProduct = async () => {
    if (!batchId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/public/marketplace?batchId=${batchId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setProduct(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch product detail:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
  }, [batchId]);

  const getHerbName = (speciesId) => {
    const found = speciesList.find(s => s.speciesId === speciesId);
    return found ? found.name : speciesId;
  };

  const downloadFile = (url, filename) => {
    if (!url) return;
    const downloadUrl = url.includes("/upload/")
      ? url.replace("/upload/", "/upload/fl_attachment/")
      : url;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", filename);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fae3]/50">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-grow py-8 px-4 max-w-7xl mx-auto w-full">
        {/* Back Button */}
        <button
          onClick={() => router.push("/marketplace")}
          className="flex items-center gap-2 text-sm text-[#31572C] font-bold hover:text-[#4F772D] transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Marketplace
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-[#4F772D]">
            <Loader2 className="w-10 h-10 animate-spin mb-3" />
            <span className="font-semibold text-sm">Loading product details...</span>
          </div>
        ) : product ? (
          <div className="bg-white rounded-2xl shadow-md border border-[#90A955]/15 p-6 sm:p-8 animate-in fade-in duration-300">
            {/* Product Page Columns */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* COLUMN 1: Image Gallery (Span 5) */}
              <div className="md:col-span-5 flex flex-col items-center justify-center w-full">
                {/* Big Active Image Box */}
                {(() => {
                  const productImages = product.marketplaceImages && product.marketplaceImages.length > 0
                    ? product.marketplaceImages
                    : product.marketplaceImage?.url
                      ? [product.marketplaceImage]
                      : [];

                  return (
                    <div className="w-full max-w-md mx-auto relative rounded-xl overflow-hidden bg-[#f8fae3]/40 border border-[#ECF39E]/60 shadow-inner group/bigimg flex items-center justify-center">
                      {productImages.length > 0 ? (
                        <img 
                          src={productImages[modalActiveImageIndex]?.url || productImages[0].url} 
                          alt="Product Primary" 
                          className="w-full h-auto block object-contain mx-auto"
                        />
                      ) : (
                        <div className="text-[#90A955] text-xs py-20">No image available</div>
                      )}

                      {/* Dynamic Chevron Sliders for dynamic route details view */}
                      {productImages.length > 1 && (
                        <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between z-20">
                          <button
                            type="button"
                            onClick={() => {
                              const len = productImages.length;
                              const nextIdx = modalActiveImageIndex === 0 ? len - 1 : modalActiveImageIndex - 1;
                              setModalActiveImageIndex(nextIdx);
                            }}
                            className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#31572C] flex items-center justify-center shadow-lg transition-colors cursor-pointer border border-[#90A955]/30"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const len = productImages.length;
                              const nextIdx = modalActiveImageIndex === len - 1 ? 0 : modalActiveImageIndex + 1;
                              setModalActiveImageIndex(nextIdx);
                            }}
                            className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#31572C] flex items-center justify-center shadow-lg transition-colors cursor-pointer border border-[#90A955]/30"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      )}

                      {/* Clickable Dot Indicators in big image box */}
                      {productImages.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 bg-[#31572C]/40 px-2.5 py-1 rounded-full backdrop-blur-sm">
                          {productImages.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setModalActiveImageIndex(idx)}
                              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                                idx === modalActiveImageIndex ? "bg-[#ECF39E] scale-125 font-bold" : "bg-white/40"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* COLUMN 2: Product Specifications & Info (Span 4) */}
              <div className="md:col-span-4 space-y-4">
                {/* Brand Link */}
                <div>
                  <span className="text-xs text-[#4F772D] hover:underline hover:text-[#31572C] cursor-pointer font-bold">
                    Visit the Ayur-Saathi Store
                  </span>
                  <h2 className="text-xl font-bold text-[#31572C] leading-snug mt-1">
                    {getHerbName(product.speciesId)} (Pure Traceable Batch)
                  </h2>
                  <p className="text-xs text-[#4F772D]/50 font-mono mt-0.5">Batch ID: #{product.batchId}</p>
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
                    <span className="text-[#4F772D] text-2xl font-semibold font-sans">-20%</span>
                    <span className="text-3xl font-extrabold text-[#31572C]">₹{product.marketplacePrice}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    M.R.P.: <span className="line-through">₹{Math.round(product.marketplacePrice * 1.25)}</span>
                  </div>
                  <span className="text-xs text-[#4F772D]/60 block">Inclusive of all taxes</span>
                </div>

                {/* Product Specification Details */}
                <div className="grid grid-cols-2 gap-y-2 text-xs border-b border-[#ECF39E]/50 pb-3">
                  <span className="font-bold text-[#4F772D]/60">Herb Species:</span>
                  <span className="text-[#31572C] font-semibold">{product.speciesId}</span>

                  <span className="font-bold text-[#4F772D]/60">Net Weight:</span>
                  <span className="text-[#31572C] font-semibold">{product.marketplaceWeightGm} Grams</span>

                  <span className="font-bold text-[#4F772D]/60">Harvest Date:</span>
                  <span className="text-[#31572C] font-semibold">
                    {product.timestamp ? new Date(product.timestamp).toLocaleDateString() : "N/A"}
                  </span>

                  <span className="font-bold text-[#4F772D]/60">Expiry Date:</span>
                  <span className="text-[#31572C] font-semibold">
                    {product.productExpiryDate ? new Date(product.productExpiryDate).toLocaleDateString() : "N/A"}
                  </span>
                </div>

                {/* About This Item Bullet list */}
                <div className="text-xs text-[#31572C]/80">
                  <h4 className="font-bold text-[#31572C] text-sm mb-1.5">About this item</h4>
                  <ul className="list-disc pl-4 space-y-2 leading-relaxed">
                    <li><strong>Natural Heritage:</strong> Premium quality {getHerbName(product.speciesId)} harvested from pesticide-free agricultural sites.</li>
                    <li><strong>Verified Quality Checks:</strong> Fully screened and approved by laboratory checks showing standard moisture, purity, and organic content.</li>
                    <li><strong>Safety & Usage:</strong> {product.marketplaceDetails || "For pharmaceutical, organic wellness extracts, or dietary supplement use."}</li>
                  </ul>
                </div>
              </div>

              {/* COLUMN 3: Buy Box (Span 3) */}
              <div className="md:col-span-3 bg-[#f8fae3]/40 border border-[#90A955]/20 rounded-xl p-5 space-y-4 shadow-sm self-start">
                <div>
                  <span className="text-2xl font-extrabold text-[#31572C]">₹{product.marketplacePrice}</span>
                  <span className="text-xs text-[#4F772D]/60 block mt-1">
                    FREE delivery <strong>Wednesday, Oct 15</strong>.
                  </span>
                </div>

                {/* Stock Level */}
                <div>
                  {product.marketplaceQuantity > 10 ? (
                    <span className="text-[#4F772D] font-bold text-sm block">In Stock</span>
                  ) : (
                    <span className="text-orange-700 font-bold text-sm block">
                      Only {product.marketplaceQuantity} left in stock - order soon
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
                {product.qrCode?.url && (
                  <div className="border-t border-[#90A955]/20 pt-4 space-y-2">
                    <span className="block text-[10px] text-[#4F772D]/50 font-bold uppercase tracking-wider">
                      Supply Chain Trace QR
                    </span>
                    <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-[#ECF39E]/60">
                      <img 
                        src={product.qrCode.url} 
                        alt="QR code" 
                        className="w-12 h-12 border border-[#ECF39E] bg-white p-0.5 rounded-lg"
                      />
                      <button
                        onClick={() => downloadFile(product.qrCode.url, `${product.batchId}_QR.png`)}
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
                      <span className="text-[10px] text-[#4F772D]/40 font-mono">Farmer ID: {product.uniqueId}</span>
                    </div>
                    <div className="text-xs text-[#31572C]/70 grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-[#90A955]" />
                        <span>GPS: {product.gpsCoordinates?.latitude?.toFixed(4)}°, {product.gpsCoordinates?.longitude?.toFixed(4)}°</span>
                      </div>
                      <div>
                        <span className="font-semibold text-[#4F772D]/50">Uploaded On: </span>
                        {product.timestamp ? new Date(product.timestamp).toLocaleDateString() : "N/A"}
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
                      <span className="text-[10px] text-[#4F772D]/40 font-mono">Lab ID: {product.acceptedBy || "N/A"}</span>
                    </div>
                    {product.tests && Object.keys(product.tests).length > 0 && (
                      <div className="mt-2 text-xs flex gap-2 flex-wrap">
                        {Object.entries(product.tests).map(([test, val]) => (
                          <span key={test} className="bg-[#ECF39E]/40 text-[#31572C] px-2 py-0.5 rounded font-mono font-bold text-[10px] border border-[#90A955]/20 uppercase">
                            {test}: {String(val)}
                          </span>
                        ))}
                      </div>
                    )}
                    {product.certificate?.url && (
                      <div className="mt-3 flex justify-between items-center bg-white p-2.5 rounded-xl border border-[#ECF39E]/40">
                        <span className="text-xs text-[#4F772D]/60 font-semibold flex items-center gap-1.5">
                          <FileText size={14} className="text-[#4F772D]" /> Quality Certificate (PDF)
                        </span>
                        <div className="flex gap-3">
                          <button
                            onClick={() => window.open(product.certificate.url, "_blank")}
                            className="text-[10px] font-bold text-[#4F772D] hover:text-[#31572C] hover:underline inline-flex items-center gap-1 cursor-pointer"
                          >
                            View <ExternalLink size={10} />
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => downloadFile(product.certificate.url, `${product.batchId}_certificate.pdf`)}
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
                      <span className="text-[10px] text-[#4F772D]/40 font-mono">Factory ID: {product.acceptedByManu || "N/A"}</span>
                    </div>
                    <div className="text-xs text-[#31572C]/70 mt-2 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <User size={14} className="text-[#90A955]" />
                        <span>Operator: {product.manuOperatorName || "N/A"}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-[#4F772D]/50">Manufactured On: </span>
                        {product.manufacturedAt ? new Date(product.manufacturedAt).toLocaleString() : "N/A"}
                      </div>
                    </div>

                    {product.manufacturingProcesses?.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-[#31572C]/10 space-y-3">
                        <span className="block text-xs font-semibold text-[#31572C] uppercase tracking-wider">
                          Processing Timeline Details:
                        </span>
                        <div className="relative pl-4 border-l border-[#90A955]/30 ml-1.5 space-y-4">
                          {product.manufacturingProcesses.map((step, i) => (
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
        ) : (
          <div className="bg-white max-w-md mx-auto p-10 rounded-2xl border border-[#90A955]/20 shadow-md text-center">
            <ShoppingBag className="w-12 h-12 text-[#90A955] mx-auto mb-3 opacity-40" />
            <h4 className="text-lg font-bold text-[#31572C] mb-1">Product Not Found</h4>
            <p className="text-xs text-[#4F772D]/60">
              The batch ID #{batchId} does not exist or has been removed from marketplace listing.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* QR Modal Overlay */}
      {isQRModalOpen && product?.qrCode?.url && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 text-center">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-500 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer text-sm font-bold shadow-sm z-30"
              onClick={() => setIsQRModalOpen(false)}
            >
              ✕
            </button>

            {/* Header */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-950">Supply Chain QR Code</h3>
              <p className="text-xs text-gray-500 mt-1">Scan the QR code below using your mobile device to view instant blockchain traceability details.</p>
            </div>

            {/* QR Image */}
            <div className="flex justify-center bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4 max-w-[200px] mx-auto shadow-inner">
              <img 
                src={product.qrCode.url} 
                alt="QR Code" 
                className="w-40 h-40 bg-white p-1 rounded-lg border border-gray-200 shadow-sm"
              />
            </div>

            {/* Action Links */}
            <div className="space-y-2">
              <a 
                href={`/batchid/${product.batchId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-[#4F772D] hover:bg-[#31572C] text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Verify Details Instantly <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
