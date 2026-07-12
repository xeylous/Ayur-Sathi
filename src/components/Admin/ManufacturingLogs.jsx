"use client";
import { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileText,
} from "lucide-react";

export default function ManufacturingLogs({ onAddToListing }) {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showDetails, setShowDetails] = useState(false);



  const downloadFile = (url, filename) => {
    if (!url) return;

    // Force Cloudinary download
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

  const LIMIT = 10;

  const fetchManufactured = async () => {
    setLoading(true);
    try {
      let queryUrl = `/api/manufactured?page=${page}&limit=${LIMIT}`;
      if (startDate) queryUrl += `&startDate=${startDate}`;
      if (endDate) queryUrl += `&endDate=${endDate}`;

      const res = await fetch(queryUrl, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        setBatches(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching manufactured logs:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchManufactured();
  }, [page, startDate, endDate]);

  const filteredBatches = batches.filter(
    (batch) =>
      batch.batchId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.speciesId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.acceptedByManu?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <h2 className="text-3xl font-extrabold text-indigo-800 mb-6">
        Manufacturing Logs
      </h2>
      
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Toolbar: Search & Date Filters */}
        <div className="p-5 border-b border-gray-100 bg-indigo-50/30 flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-grow max-w-4xl">
            {/* Search */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 text-indigo-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by Batch ID, Herb, or Manufacturer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
              />
            </div>

            {/* Date Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-gray-300">
                <span className="text-xs font-semibold text-gray-400 uppercase">From</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                  className="text-xs text-gray-700 outline-none font-medium bg-transparent"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-gray-300">
                <span className="text-xs font-semibold text-gray-400 uppercase">To</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                  }}
                  className="text-xs text-gray-700 outline-none font-medium bg-transparent"
                />
              </div>

              {(startDate || endDate) && (
                <button
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                    setPage(1);
                  }}
                  className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="text-sm text-indigo-600 font-semibold bg-indigo-50 px-3 py-1.5 rounded-lg self-end xl:self-auto">
            Page {page}
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-indigo-900 text-white text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-indigo-800">Batch ID</th>
                <th className="p-4 font-bold border-b border-indigo-800">Herb / Species</th>
                <th className="p-4 font-bold border-b border-indigo-800">Quantity</th>
                <th className="p-4 font-bold border-b border-indigo-800">Manufacturer ID</th>
                <th className="p-4 font-bold border-b border-indigo-800">Manufactured Date</th>
                <th className="p-4 font-bold border-b border-indigo-800 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <div className="flex justify-center items-center space-x-2 text-indigo-600">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Loading records...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredBatches.length > 0 ? (
                filteredBatches.map((batch, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-indigo-50/30 transition-colors"
                  >
                    <td className="p-4 font-semibold text-indigo-900">
                      {batch.batchId}
                    </td>
                    <td className="p-4">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-bold border border-indigo-100">
                        {batch.speciesId}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-medium text-gray-600">{batch.quantity} units</td>
                    <td className="p-4 font-mono text-xs text-gray-600">{batch.acceptedByManu || "N/A"}</td>
                    <td className="p-4 text-gray-500 flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-2 opacity-50 text-indigo-600" />
                      {formatDate(batch.manufacturedAt || batch.createdAt)}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        className="p-1.5 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-all"
                        onClick={() => {
                          setSelectedBatch(batch);
                          setShowDetails(true);
                        }}
                      >
                        <FileText className="w-5 h-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center text-gray-400 italic"
                  >
                    {searchTerm
                      ? "No matching logs found."
                      : "No completed manufactured batches logged yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Details Drawer/Modal */}
        {showDetails && selectedBatch && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors text-xl"
                onClick={() => setShowDetails(false)}
              >
                ✖
              </button>

              <h3 className="text-2xl font-extrabold text-indigo-900 mb-6 pr-6">
                Manufactured Batch — <span className="text-teal-600">{selectedBatch.batchId}</span>
              </h3>

              <div className="space-y-6 text-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase">Herb / Species</span>
                    <span className="font-semibold text-indigo-955">{selectedBatch.speciesId}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase">Quantity</span>
                    <span className="font-semibold text-indigo-955">{selectedBatch.quantity || 0} units</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase">Status</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 mt-0.5 border border-teal-200">
                      Completed & QR Generated
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase">Manufacturer Operator</span>
                    <span className="font-semibold text-indigo-955">{selectedBatch.manuOperatorName || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase">Verified Lab ID</span>
                    <span className="font-mono text-xs text-gray-600">{selectedBatch.acceptedBy || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase">Manufacturer ID</span>
                    <span className="font-mono text-xs text-gray-600">{selectedBatch.acceptedByManu || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase">Manufactured Date</span>
                    <span>
                      {selectedBatch.manufacturedAt
                        ? new Date(selectedBatch.manufacturedAt).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase">Record Logged At</span>
                    <span>
                      {selectedBatch.createdAt
                        ? new Date(selectedBatch.createdAt).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                </div>

                {/* QR Code */}
                {selectedBatch.qrCode?.url && (
                  <div className="bg-indigo-50/20 p-4 rounded-xl border border-indigo-100 flex flex-col items-center">
                    <p className="font-semibold text-indigo-900 text-sm mb-3">Product QR Code</p>
                    <img
                      src={selectedBatch.qrCode.url}
                      alt="Product QR Code"
                      className="w-44 h-44 border border-indigo-100 rounded-lg bg-white p-2 shadow-sm"
                    />
                  </div>
                )}

                {/* Actions: QR & Certificate Downloads */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  {/* QR Download Button */}
                  {selectedBatch.qrCode?.url && (
                    <button
                      onClick={() =>
                        downloadFile(
                          selectedBatch.qrCode.url,
                          `${selectedBatch.batchId}_QR.png`
                        )
                      }
                      className="w-full sm:w-auto bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow hover:bg-indigo-800 transition-all font-semibold flex items-center justify-center gap-2 hover:shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"></path>
                      </svg>
                      Download QR Code
                    </button>
                  )}

                  {/* Certificate Download Button */}
                  {selectedBatch.certificate?.url && (
                    <button
                      onClick={() =>
                        downloadFile(
                          selectedBatch.certificate.url,
                          `${selectedBatch.batchId}_certificate.pdf`
                        )
                      }
                      className="w-full sm:w-auto bg-teal-600 text-white px-5 py-2.5 rounded-xl shadow hover:bg-teal-700 transition-all font-semibold flex items-center justify-center gap-2 hover:shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"></path>
                      </svg>
                      Download Certificate
                    </button>
                  )}
                </div>

                {/* Processing Steps */}
                {selectedBatch.manufacturingProcesses?.length > 0 && (
                  <div className="mt-6 border-t pt-5">
                    <h4 className="font-bold text-lg text-indigo-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                      </svg>
                      Manufacturing Processing History
                    </h4>
                    <div className="relative pl-6 border-l-2 border-indigo-200 ml-3 space-y-6">
                      {selectedBatch.manufacturingProcesses.map((step, i) => (
                        <div key={i} className="relative">
                          {/* Dot indicator */}
                          <div className="absolute -left-[31px] top-1.5 bg-indigo-600 w-4 h-4 rounded-full border-4 border-white shadow" />
                          <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50 hover:bg-indigo-50 transition-colors">
                            <div className="flex justify-between items-start gap-4 mb-2 flex-wrap text-sm">
                              <span className="font-semibold text-indigo-900">
                                {step.processName}
                              </span>
                              <span className="text-xs text-gray-500 font-mono">
                                {step.date ? new Date(step.date).toLocaleString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                }) : "N/A"}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
                              <div>
                                <span className="font-semibold text-gray-500">Operator: </span>
                                {step.operator || selectedBatch.manuOperatorName || "N/A"}
                              </div>
                              {step.notes && (
                                <div className="mt-1 italic text-gray-500 bg-white p-2.5 rounded border border-gray-100">
                                  "{step.notes}"
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Marketplace Listing Section */}
                <div className="mt-6 border-t pt-5">
                  <h4 className="font-bold text-lg text-indigo-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                    Marketplace Listing Status
                  </h4>

                  <div className="bg-indigo-50/30 p-4 rounded-xl border border-indigo-100/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      {selectedBatch.isMarketplaceListed ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                            Active Listing
                          </span>
                          <div className="flex items-center gap-3 mt-1">
                            {selectedBatch.marketplaceImage?.url && (
                              <img 
                                src={selectedBatch.marketplaceImage.url} 
                                alt="Product" 
                                className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                              />
                            )}
                            <div>
                              <div className="text-sm font-semibold text-gray-800">
                                ₹{selectedBatch.marketplacePrice} • {selectedBatch.marketplaceQuantity} units ({selectedBatch.marketplaceWeightGm}g each)
                              </div>
                              {selectedBatch.marketplaceDescription && (
                                <p className="text-xs text-gray-500 line-clamp-2 max-w-md mt-0.5">
                                  {selectedBatch.marketplaceDescription}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
                            Not Listed
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            This manufactured batch is not yet listed on the public marketplace.
                          </p>
                        </div>
                      )}
                    </div>

                    {onAddToListing && (
                      <button
                        onClick={() => {
                          onAddToListing(selectedBatch);
                          setShowDetails(false);
                        }}
                        className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl transition-colors cursor-pointer self-start sm:self-auto shadow-sm hover:shadow"
                      >
                        {selectedBatch.isMarketplaceListed ? "Edit Listing Info" : "Add to Marketplace"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 bg-indigo-50/30 border-t border-gray-200 flex justify-between items-center">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1 || loading}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </button>

          <span className="text-sm font-semibold text-indigo-900">
            Showing Page {page}
          </span>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={batches.length < LIMIT || loading}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </>
  );
}
