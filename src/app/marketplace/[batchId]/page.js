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
  ArrowLeft
} from "lucide-react";
import { speciesList } from "@/lib/cropdetails";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const batchId = params?.batchId;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalActiveImageIndex, setModalActiveImageIndex] = useState(0);

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
          className="flex items-center gap-2 text-sm text-indigo-950 font-bold hover:text-indigo-700 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Marketplace
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-indigo-600">
            <Loader2 className="w-10 h-10 animate-spin mb-3" />
            <span className="font-semibold text-sm">Loading product details...</span>
          </div>
        ) : product ? (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8 animate-in fade-in duration-300">
            {/* Amazon Product Page Columns */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* COLUMN 1: Image Gallery (Span 5) */}
              <div className="md:col-span-5 flex flex-col sm:flex-row-reverse gap-4">
                {/* Big Active Image Box */}
                {(() => {
                  const productImages = product.marketplaceImages && product.marketplaceImages.length > 0
                    ? product.marketplaceImages
                    : product.marketplaceImage?.url
                      ? [product.marketplaceImage]
                      : [];

                  return (
                    <>
                      <div className="flex-grow aspect-square bg-[#F7F7F7] border border-gray-100 rounded-xl overflow-hidden flex items-center justify-center relative shadow-inner group/bigimg">
                        {productImages.length > 0 ? (
                          <img 
                            src={productImages[modalActiveImageIndex]?.url || productImages[0].url} 
                            alt="Product Primary" 
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <div className="text-gray-400 text-xs">No image available</div>
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
                              className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 text-xs flex items-center justify-center shadow-lg transition-colors cursor-pointer border border-gray-150"
                            >
                              ◀
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const len = productImages.length;
                                const nextIdx = modalActiveImageIndex === len - 1 ? 0 : modalActiveImageIndex + 1;
                                setModalActiveImageIndex(nextIdx);
                              }}
                              className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 text-xs flex items-center justify-center shadow-lg transition-colors cursor-pointer border border-gray-150"
                            >
                              ▶
                            </button>
                          </div>
                        )}

                        {/* Clickable Dot Indicators in big image box */}
                        {productImages.length > 1 && (
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 bg-black/30 px-2.5 py-1 rounded-full backdrop-blur-sm">
                            {productImages.map((_, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setModalActiveImageIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                                  idx === modalActiveImageIndex ? "bg-white scale-125 font-bold" : "bg-white/40"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Thumbnail Selector Column */}
                      {productImages.length > 1 && (
                        <div className="flex sm:flex-col gap-2 flex-wrap items-center justify-start overflow-y-auto max-h-[400px]">
                          {productImages.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setModalActiveImageIndex(idx)}
                              className={`w-14 h-14 rounded-lg overflow-hidden border-2 bg-white transition-all cursor-pointer ${
                                idx === modalActiveImageIndex ? "border-indigo-600 ring-1 ring-indigo-500 shadow-sm" : "border-gray-200 hover:border-gray-400"
                              }`}
                            >
                              <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* COLUMN 2: Product Specifications & Info (Span 4) */}
              <div className="md:col-span-4 space-y-4">
                {/* Brand Link */}
                <div>
                  <span className="text-xs text-indigo-900 hover:underline hover:text-[#4F772D] cursor-pointer font-bold">
                    Visit the Ayur-Saathi Store
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 leading-snug mt-1">
                    {getHerbName(product.speciesId)} (Pure Traceable Batch)
                  </h2>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">Batch ID: #{product.batchId}</p>
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
                  <span className="text-xs font-semibold text-indigo-900 ml-2 hover:underline hover:text-[#4F772D] cursor-pointer">
                    4.8 (142 ratings)
                  </span>
                </div>

                {/* Price Info */}
                <div className="border-b border-gray-100 pb-3 space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-emerald-700 text-2xl font-semibold font-sans">-20%</span>
                    <span className="text-3xl font-extrabold text-gray-900">₹{product.marketplacePrice}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    M.R.P.: <span className="line-through">₹{Math.round(product.marketplacePrice * 1.25)}</span>
                  </div>
                  <span className="text-xs text-gray-600 block">Inclusive of all taxes</span>
                </div>

                {/* Product Specification Details */}
                <div className="grid grid-cols-2 gap-y-2 text-xs border-b border-gray-100 pb-3">
                  <span className="font-bold text-gray-500">Herb Species:</span>
                  <span className="text-gray-800 font-semibold">{product.speciesId}</span>

                  <span className="font-bold text-gray-500">Net Weight:</span>
                  <span className="text-gray-800 font-semibold">{product.marketplaceWeightGm} Grams</span>

                  <span className="font-bold text-gray-500">Harvest Date:</span>
                  <span className="text-gray-800 font-semibold">
                    {product.timestamp ? new Date(product.timestamp).toLocaleDateString() : "N/A"}
                  </span>

                  <span className="font-bold text-gray-500">Expiry Date:</span>
                  <span className="text-gray-800 font-semibold">
                    {product.productExpiryDate ? new Date(product.productExpiryDate).toLocaleDateString() : "N/A"}
                  </span>
                </div>

                {/* About This Item Bullet list */}
                <div className="text-xs text-gray-700">
                  <h4 className="font-bold text-gray-900 text-sm mb-1.5">About this item</h4>
                  <ul className="list-disc pl-4 space-y-2 leading-relaxed">
                    <li><strong>Natural Heritage:</strong> Premium quality {getHerbName(product.speciesId)} harvested from pesticide-free agricultural sites.</li>
                    <li><strong>Verified Quality Checks:</strong> Fully screened and approved by laboratory checks showing standard moisture, purity, and organic content.</li>
                    <li><strong>Safety & Usage:</strong> {product.marketplaceDetails || "For pharmaceutical, organic wellness extracts, or dietary supplement use."}</li>
                  </ul>
                </div>
              </div>

              {/* COLUMN 3: Amazon Buy Box (Span 3) */}
              <div className="md:col-span-3 bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm self-start">
                <div>
                  <span className="text-2xl font-extrabold text-gray-900">₹{product.marketplacePrice}</span>
                  <span className="text-xs text-gray-500 block mt-1">
                    FREE delivery <strong>Wednesday, Oct 15</strong>.
                  </span>
                </div>

                {/* Stock Level */}
                <div>
                  {product.marketplaceQuantity > 10 ? (
                    <span className="text-green-700 font-bold text-sm block">In Stock</span>
                  ) : (
                    <span className="text-orange-700 font-bold text-sm block">
                      Only {product.marketplaceQuantity} left in stock - order soon
                    </span>
                  )}
                  <span className="text-xs text-gray-500 mt-1 block">Sold by Ayur-Saathi & Fulfilled by Store</span>
                </div>

                {/* Actions buttons */}
                <div className="space-y-2 pt-2">
                  <button className="w-full bg-[#4F772D] hover:bg-[#31572C] text-white font-bold text-xs py-3 rounded-2xl transition-all shadow-sm cursor-pointer">
                    Add to Cart
                  </button>
                  <button className="w-full bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-xs py-3 rounded-2xl transition-all shadow-sm cursor-pointer">
                    Buy Now
                  </button>
                </div>

                {/* Trust Badge */}
                <div className="border-t pt-3 flex items-center gap-2.5 text-xs text-gray-500">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Secure transaction</span>
                </div>

                {/* QR Box in Right Column */}
                {product.qrCode?.url && (
                  <div className="border-t pt-4 space-y-2">
                    <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      Supply Chain Trace QR
                    </span>
                    <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-100">
                      <img 
                        src={product.qrCode.url} 
                        alt="QR code" 
                        className="w-12 h-12 border bg-white p-0.5 rounded-lg"
                      />
                      <button
                        onClick={() => downloadFile(product.qrCode.url, `${product.batchId}_QR.png`)}
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
                      <span className="text-[10px] text-gray-400 font-mono">Farmer ID: {product.uniqueId}</span>
                    </div>
                    <div className="text-xs text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-gray-400" />
                        <span>GPS: {product.gpsCoordinates?.latitude?.toFixed(4)}°, {product.gpsCoordinates?.longitude?.toFixed(4)}°</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-500">Uploaded On: </span>
                        {product.timestamp ? new Date(product.timestamp).toLocaleDateString() : "N/A"}
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
                      <span className="text-[10px] text-gray-400 font-mono">Lab ID: {product.acceptedBy || "N/A"}</span>
                    </div>
                    {product.tests && Object.keys(product.tests).length > 0 && (
                      <div className="mt-2 text-xs flex gap-2 flex-wrap">
                        {Object.entries(product.tests).map(([test, val]) => (
                          <span key={test} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono font-bold text-[10px] border border-blue-100 uppercase">
                            {test}: {String(val)}
                          </span>
                        ))}
                      </div>
                    )}
                    {product.certificate?.url && (
                      <div className="mt-3 flex justify-between items-center bg-white p-2.5 rounded-xl border border-blue-50">
                        <span className="text-xs text-gray-500 font-semibold flex items-center gap-1.5">
                          <FileText size={14} className="text-blue-500" /> Quality Certificate (PDF)
                        </span>
                        <div className="flex gap-3">
                          <button
                            onClick={() => window.open(product.certificate.url, "_blank")}
                            className="text-[10px] font-bold text-indigo-650 hover:text-indigo-855 hover:underline inline-flex items-center gap-1 cursor-pointer"
                          >
                            View <ExternalLink size={10} />
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => downloadFile(product.certificate.url, `${product.batchId}_certificate.pdf`)}
                            className="text-[10px] font-bold text-blue-650 hover:text-blue-855 hover:underline inline-flex items-center gap-1 cursor-pointer"
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
                      <span className="text-[10px] text-gray-400 font-mono">Factory ID: {product.acceptedByManu || "N/A"}</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-2 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <User size={14} className="text-gray-400" />
                        <span>Operator: {product.manuOperatorName || "N/A"}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-500">Manufactured On: </span>
                        {product.manufacturedAt ? new Date(product.manufacturedAt).toLocaleString() : "N/A"}
                      </div>
                    </div>

                    {product.manufacturingProcesses?.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-indigo-100 space-y-3">
                        <span className="block text-xs font-semibold text-indigo-955 uppercase tracking-wider">
                          Processing Timeline Details:
                        </span>
                        <div className="relative pl-4 border-l border-indigo-200 ml-1.5 space-y-4">
                          {product.manufacturingProcesses.map((step, i) => (
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
        ) : (
          <div className="bg-white max-w-md mx-auto p-10 rounded-2xl border border-gray-200 shadow-md text-center">
            <ShoppingBag className="w-12 h-12 text-[#90A955] mx-auto mb-3 opacity-40" />
            <h4 className="text-lg font-bold text-indigo-950 mb-1">Product Not Found</h4>
            <p className="text-xs text-gray-500">
              The batch ID #{batchId} does not exist or has been removed from marketplace listing.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
