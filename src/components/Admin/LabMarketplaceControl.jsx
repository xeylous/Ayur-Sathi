"use client";
import { useState, useEffect } from "react";
import { 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  Loader2, 
  Eye, 
  Upload, 
  ShoppingBag,
  Scale,
  Package,
  DollarSign,
  Tag,
  Search,
  Sparkles,
  Info
} from "lucide-react";
import { speciesList } from "@/lib/cropdetails";

const LabMarketplaceControl = ({ 
  selectedListingBatch, 
  setSelectedListingBatch 
}) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form states
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [weightGm, setWeightGm] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  
  // Custom multi-image structure: array of objects { url: string, file: File | null }
  const [listingImages, setListingImages] = useState([]);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);

  const [listingLoading, setListingLoading] = useState(false);
  const [formMessage, setFormMessage] = useState(null);

  // Preview Modal state
  const [showPreview, setShowPreview] = useState(false);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/manufactured?limit=50", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setBatches(data.data || []);
      }
    } catch (error) {
      console.error("Failed to load manufactured batches:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  // Initialize form fields when selected batch changes
  useEffect(() => {
    if (selectedListingBatch) {
      setPrice(selectedListingBatch.marketplacePrice || "");
      setQuantity(selectedListingBatch.marketplaceQuantity || "");
      setWeightGm(selectedListingBatch.marketplaceWeightGm || "");
      setDescription(selectedListingBatch.marketplaceDescription || "");
      setDetails(selectedListingBatch.marketplaceDetails || "");
      
      const batchImages = selectedListingBatch.marketplaceImages || [];
      if (batchImages.length > 0) {
        setListingImages(batchImages.map(img => ({ url: img.url, file: null })));
      } else if (selectedListingBatch.marketplaceImage?.url) {
        setListingImages([{ url: selectedListingBatch.marketplaceImage.url, file: null }]);
      } else {
        setListingImages([]);
      }
      
      setActivePreviewIndex(0);
      setFormMessage(null);
      setShowPreview(false);
    }
  }, [selectedListingBatch]);

  const getHerbName = (speciesId) => {
    const found = speciesList.find(s => s.speciesId === speciesId);
    return found ? found.name : speciesId;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = files.map(file => ({
        url: URL.createObjectURL(file),
        file
      }));
      setListingImages(prev => [...prev, ...newImages]);
      // Set active preview index to the newly added image if it was empty
      if (listingImages.length === 0) {
        setActivePreviewIndex(0);
      }
    }
  };

  const removeImage = (index) => {
    setListingImages(prev => {
      const next = prev.filter((_, i) => i !== index);
      if (activePreviewIndex >= next.length) {
        setActivePreviewIndex(Math.max(0, next.length - 1));
      }
      return next;
    });
  };

  const handlePublish = async () => {
    if (listingLoading) return;

    if (!price || Number(price) <= 0) {
      setFormMessage({ type: "error", content: "Price must be greater than zero." });
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      setFormMessage({ type: "error", content: "Quantity must be greater than zero." });
      return;
    }
    if (!weightGm || Number(weightGm) <= 0) {
      setFormMessage({ type: "error", content: "Weight must be greater than zero." });
      return;
    }
    if (!description.trim()) {
      setFormMessage({ type: "error", content: "Description is required." });
      return;
    }

    setListingLoading(true);
    setFormMessage(null);

    try {
      const formData = new FormData();
      formData.append("batchId", selectedListingBatch.batchId);
      formData.append("price", String(price));
      formData.append("quantity", String(quantity));
      formData.append("weightGm", String(weightGm));
      formData.append("description", description.trim());
      formData.append("details", details.trim());
      
      // Append images (supporting both files and URLs)
      listingImages.forEach(img => {
        if (img.file) {
          formData.append("images", img.file);
        } else {
          formData.append("images", img.url);
        }
      });

      const res = await fetch("/api/manufactured", {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setFormMessage({ type: "success", content: data.message });
        setSelectedListingBatch(null); // Back to list
        fetchBatches(); // Refresh table
      } else {
        setFormMessage({ type: "error", content: data.message || "Failed to publish listing." });
      }
    } catch (err) {
      console.error(err);
      setFormMessage({ type: "error", content: "Server connection failed." });
    }
    setListingLoading(false);
  };

  const filteredBatches = batches.filter(
    (b) =>
      b.batchId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getHerbName(b.speciesId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- RENDER 1: CREATE / EDIT FORM ---
  if (selectedListingBatch) {
    return (
      <>
        {/* Navigation back */}
        <button
          onClick={() => setSelectedListingBatch(null)}
          className="flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft size={16} className="mr-1.5" /> Back to Batch Inventory
        </button>

        <h2 className="text-3xl font-extrabold text-indigo-800 mb-6 flex items-center gap-2">
          <ShoppingBag className="text-teal-600 w-8 h-8" />
          {selectedListingBatch.isMarketplaceListed ? "Edit Product Listing" : "List Product on Marketplace"}
        </h2>

        {formMessage && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm font-semibold border ${
              formMessage.type === "success"
                ? "bg-green-50 text-green-800 border-green-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            {formMessage.content}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Area */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 space-y-6">
            <h3 className="text-lg font-bold text-indigo-900 border-b pb-3 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              Listing Details — Batch #{selectedListingBatch.batchId}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Herb / Crop Name
                </label>
                <input
                  type="text"
                  value={getHerbName(selectedListingBatch.speciesId)}
                  disabled
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 cursor-not-allowed outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Species Code
                </label>
                <input
                  type="text"
                  value={selectedListingBatch.speciesId}
                  disabled
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-mono text-gray-600 cursor-not-allowed outline-none uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Price (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 font-semibold text-sm">₹</span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    placeholder="e.g. 450"
                    className="w-full pl-7 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Quantity (Stock Units) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  placeholder="e.g. 100"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Weight per Unit (grams) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={weightGm}
                  onChange={(e) => setWeightGm(e.target.value)}
                  required
                  placeholder="e.g. 250"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Product Description *
              </label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Write a compelling product description detailing benefits, sourcing details, and organic qualities..."
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Usage Instructions & Specifications
              </label>
              <textarea
                rows="2"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Ingredients list, suggested daily dosage, safety certificates, etc..."
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm resize-none"
              />
            </div>
          </div>

          {/* Right Image/Actions Panel */}
          <div className="space-y-6">
            {/* Image Upload Box */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 self-start">
                Product Images
              </h4>

              {/* Active Image Preview */}
              {listingImages.length > 0 ? (
                <div className="relative group w-full aspect-square rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 mb-4">
                  <img
                    src={listingImages[activePreviewIndex]?.url}
                    alt="Active Product"
                    className="w-full h-full object-cover"
                  />
                  {listingImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setActivePreviewIndex(prev => (prev === 0 ? listingImages.length - 1 : prev - 1))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition-colors cursor-pointer text-xs font-bold"
                      >
                        ◀
                      </button>
                      <button
                        type="button"
                        onClick={() => setActivePreviewIndex(prev => (prev === listingImages.length - 1 ? 0 : prev + 1))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition-colors cursor-pointer text-xs font-bold"
                      >
                        ▶
                      </button>
                    </>
                  )}
                  {/* Remove Hover overlay */}
                  <button
                    type="button"
                    onClick={() => removeImage(activePreviewIndex)}
                    className="absolute top-2 right-2 bg-red-650 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md cursor-pointer transition-colors"
                  >
                    Delete Image
                  </button>
                </div>
              ) : (
                <div className="w-full aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center p-6 text-center mb-4">
                  <ShoppingBag className="w-10 h-10 text-gray-300 mb-2" />
                  <span className="text-xs text-gray-400">No images uploaded yet.</span>
                </div>
              )}

              {/* Thumbnails strip & Upload button */}
              <div className="w-full">
                <div className="flex flex-wrap gap-2 items-center">
                  {listingImages.map((img, idx) => (
                    <div 
                      key={idx} 
                      className={`relative w-12 h-12 rounded-lg overflow-hidden border cursor-pointer group/thumb transition-all ${
                        idx === activePreviewIndex ? "border-indigo-600 ring-2 ring-indigo-500/25" : "border-gray-200"
                      }`}
                      onClick={() => setActivePreviewIndex(idx)}
                    >
                      <img 
                        src={img.url} 
                        alt={`thumb-${idx}`} 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(idx);
                        }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] rounded-full flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {/* Add Image Action Box */}
                  <label className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-500 bg-gray-50 hover:bg-indigo-50 flex items-center justify-center cursor-pointer transition-all">
                    <Upload className="w-4 h-4 text-gray-400 hover:text-indigo-650" />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Save Actions Box */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 space-y-3">
              <button
                type="button"
                onClick={() => {
                  if (!price || !quantity || !weightGm || !description.trim()) {
                    setFormMessage({ type: "error", content: "Please fill in price, stock, weight, and description before previewing." });
                    return;
                  }
                  setShowPreview(true);
                }}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg"
              >
                <Eye size={16} /> Preview Card
              </button>

              <button
                type="button"
                onClick={handlePublish}
                disabled={listingLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {listingLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish Listing"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* --- PREVIEW MODAL --- */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 relative">
              <button
                className="absolute top-4 right-4 bg-gray-100 hover:bg-red-50 hover:text-red-650 text-gray-400 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer text-xs font-bold z-30"
                onClick={() => setShowPreview(false)}
              >
                ✕
              </button>

              <h3 className="text-lg font-extrabold text-indigo-950 mb-4 text-center">
                Marketplace Card Preview
              </h3>

              {/* Exact Marketplace Card Simulation */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col h-[520px] relative">
                {/* Visual Header card */}
                <div className="p-6 bg-gradient-to-br from-indigo-900 to-indigo-950 text-white flex flex-col justify-between h-40 relative group/preview">
                  {listingImages.length > 0 && (
                    <img 
                      src={listingImages[activePreviewIndex]?.url} 
                      alt="Product" 
                      className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay"
                    />
                  )}
                  {listingImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setActivePreviewIndex(prev => (prev === 0 ? listingImages.length - 1 : prev - 1))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 hover:bg-white text-gray-800 text-[10px] flex items-center justify-center shadow-md z-20 cursor-pointer"
                      >
                        ◀
                      </button>
                      <button
                        type="button"
                        onClick={() => setActivePreviewIndex(prev => (prev === listingImages.length - 1 ? 0 : prev + 1))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 hover:bg-white text-gray-800 text-[10px] flex items-center justify-center shadow-md z-20 cursor-pointer"
                      >
                        ▶
                      </button>
                    </>
                  )}
                  {listingImages.length > 1 && (
                    <div className="absolute right-3 bottom-3 z-20 flex gap-1">
                      {listingImages.map((_, idx) => (
                        <span 
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            idx === activePreviewIndex ? "bg-white scale-125" : "bg-white/40"
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-start relative z-10">
                    <span className="bg-white/20 backdrop-blur text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/10 uppercase tracking-wide">
                      Batch #{selectedListingBatch.batchId}
                    </span>
                    <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Verified
                    </span>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-extrabold truncate">
                      {getHerbName(selectedListingBatch.speciesId)}
                    </h3>
                    <p className="text-[10px] text-indigo-200 mt-0.5 flex items-center gap-1 font-mono">
                      <Tag size={10} /> Species: {selectedListingBatch.speciesId}
                    </p>
                  </div>
                </div>

                {/* Info Fields */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Specs Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 text-center">
                        <DollarSign className="w-3.5 h-3.5 text-indigo-650 mx-auto mb-0.5" />
                        <span className="block text-[8px] text-gray-400 font-bold uppercase">Price</span>
                        <span className="text-[11px] font-black text-gray-700">₹{price}</span>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 text-center">
                        <Package className="w-3.5 h-3.5 text-[#90A955] mx-auto mb-0.5" />
                        <span className="block text-[8px] text-gray-400 font-bold uppercase">Stock</span>
                        <span className="text-[11px] font-black text-gray-700">{quantity} units</span>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 text-center">
                        <Scale className="w-3.5 h-3.5 text-teal-600 mx-auto mb-0.5" />
                        <span className="block text-[8px] text-gray-400 font-bold uppercase">Weight</span>
                        <span className="text-[11px] font-black text-gray-700">{weightGm}g</span>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                        Product Description
                      </span>
                      <p className="text-[11px] text-gray-600 line-clamp-3 leading-relaxed">
                        {description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-gray-100 mt-3">
                    <button
                      type="button"
                      disabled
                      className="w-full bg-indigo-900 text-white font-bold text-[10px] py-2.5 rounded-lg flex items-center justify-center gap-1.5 opacity-80 cursor-not-allowed"
                    >
                      View Details & Trace
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // --- RENDER 2: INVENTORY LIST TABLE ---
  return (
    <>
      <h2 className="text-3xl font-extrabold text-indigo-800 mb-6">
        Marketplace Listing Control
      </h2>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Search header */}
        <div className="p-5 border-b border-gray-100 bg-indigo-50/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-3 text-indigo-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Batch ID or Herb Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
            />
          </div>
          <div className="text-xs text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100/50 flex items-center gap-1.5">
            <Info size={14} />
            <span>Select a completed batch below to manage its marketplace listing.</span>
          </div>
        </div>

        {/* Table layout */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-indigo-900 text-white text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-indigo-800">Batch ID</th>
                <th className="p-4 font-bold border-b border-indigo-800">Herb / Crop Name</th>
                <th className="p-4 font-bold border-b border-indigo-800">Stock (Units)</th>
                <th className="p-4 font-bold border-b border-indigo-800">Price</th>
                <th className="p-4 font-bold border-b border-indigo-800">Status</th>
                <th className="p-4 font-bold border-b border-indigo-800 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-indigo-650">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Loading records...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredBatches.length > 0 ? (
                filteredBatches.map((b) => (
                  <tr key={b.batchId} className="border-b border-gray-100 hover:bg-indigo-50/20 transition-colors">
                    <td className="p-4 font-bold text-indigo-950">{b.batchId}</td>
                    <td className="p-4 font-semibold text-gray-700">{getHerbName(b.speciesId)}</td>
                    <td className="p-4 font-mono text-xs">
                      {b.isMarketplaceListed ? `${b.marketplaceQuantity} units` : <span className="text-gray-400">N/A</span>}
                    </td>
                    <td className="p-4 font-semibold text-gray-700">
                      {b.isMarketplaceListed ? `₹${b.marketplacePrice}` : <span className="text-gray-400">N/A</span>}
                    </td>
                    <td className="p-4">
                      {b.isMarketplaceListed ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                          Listed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200">
                          Unlisted
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedListingBatch(b)}
                        className={`text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow ${
                          b.isMarketplaceListed
                            ? "bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        }`}
                      >
                        {b.isMarketplaceListed ? "Edit Info" : "List Product"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400 italic">
                    No completed manufactured logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default LabMarketplaceControl;
