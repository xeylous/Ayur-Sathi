import { useState, useEffect } from "react";
import {
  Search,
  Package,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MoreHorizontal,
  FileText,
} from "lucide-react";

export default function ManufacturedBatches({ showToast }) {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
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
  // Pagination limit as requested
  const LIMIT = 10;

  // 🔄 Fetch Data
  const fetchManufactured = async () => {
    setLoading(true);
    try {
      // Using the route you provided
      const res = await fetch(`/api/manufactured?page=${page}&limit=${LIMIT}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);

      if (data.success) {
        setBatches(data.data || []);
      } else {
        // Only show toast on error, not on empty list
        if (data.message) showToast(data.message, "error");
      }
    } catch (error) {
      console.error("Error fetching manufactured batches:", error);
      showToast("Failed to load history.", "error");
    }
    setLoading(false);
  };

  // Fetch on page change
  useEffect(() => {
    fetchManufactured();
  }, [page]);

  // 🔍 Local Filter Logic
  // Since the API snippet provided doesn't have a ?search= param,
  // we filter the 10 results currently on screen.
  const filteredBatches = batches.filter(
    (batch) =>
      batch.batchId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.speciesId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 📄 Date Formatter
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center">
            <Package className="w-8 h-8 mr-3 text-blue-600" />
            Manufactured History
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Archive of all fully manufactured and processed batches.
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Toolbar: Search & Refresh */}
        <div className="p-5 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Batch ID or Species..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="text-sm text-gray-500 font-medium">Page {page}</div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b">Batch ID</th>
                <th className="p-4 font-bold border-b">Species</th>
                <th className="p-4 font-bold border-b">Quantity</th>
                <th className="p-4 font-bold border-b">Manufactured Date</th>
                <th className="p-4 font-bold border-b">Status</th>
                <th className="p-4 font-bold border-b text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <div className="flex justify-center items-center space-x-2 text-gray-400">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Loading records...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredBatches.length > 0 ? (
                filteredBatches.map((batch, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="p-4 font-medium text-blue-900">
                      {batch.batchId}
                    </td>
                    <td className="p-4">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold border border-gray-200">
                        {batch.speciesId}
                      </span>
                    </td>
                    <td className="p-4 font-mono">{batch.quantity} units</td>
                    <td className="p-4 text-gray-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 opacity-50" />
                      {formatDate(batch.createdAt || batch.updatedAt)}
                    </td>
                    <td className="p-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex w-fit items-center">
                        {batch.status || "Completed"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {/* Example Action: View Details or Certificate */}
                      <button
                        className="text-gray-400 hover:text-blue-600 transition-colors"
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
                      ? "No matching batches found."
                      : "No manufactured batches found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showDetails && selectedBatch && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 relative">
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors text-xl"
                onClick={() => setShowDetails(false)}
              >
                ✖
              </button>

              <h3 className="text-2xl font-extrabold text-gray-800 mb-6 pr-6">
                Batch Details — <span className="text-blue-600">{selectedBatch.batchId}</span>
              </h3>

              <div className="space-y-3 text-gray-700 text-sm">
                <p>
                  <strong>Species:</strong> {selectedBatch.speciesId}
                </p>
                <p>
                  <strong>Quantity:</strong> {selectedBatch.quantity} units
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedBatch.isManufactured ? "Manufactured" : "Not Manufactured"}
                </p>
                <p>
                  <strong>Manufacturer Operator:</strong>{" "}
                  {selectedBatch.manuOperatorName}
                </p>
                <p>
                  <strong>Accepted By Lab:</strong> {selectedBatch.acceptedBy}
                </p>
                <p>
                  <strong>Accepted By Manufacturer:</strong>{" "}
                  {selectedBatch.acceptedByManu}
                </p>
                <p>
                  <strong>Manufactured Date:</strong>{" "}
                  {new Date(selectedBatch.manufacturedAt).toLocaleString()}
                </p>
                <p>
                  <strong>Uploaded At:</strong>{" "}
                  {new Date(selectedBatch.createdAt).toLocaleString()}
                </p>

                <hr className="my-4" />


                {/* QR Code */}
                {selectedBatch.qrCode?.url && (
                  <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex flex-col items-center">
                    <p className="font-semibold text-indigo-900 text-sm mb-3">Product QR Code</p>
                    <img
                      src={selectedBatch.qrCode.url}
                      alt="Product QR Code"
                      className="w-44 h-44 border rounded-lg bg-white p-2 shadow-sm"
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
                      className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow hover:bg-blue-700 transition-all font-semibold flex items-center justify-center gap-2 hover:shadow-lg"
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
                      className="w-full sm:w-auto bg-green-600 text-white px-5 py-2.5 rounded-xl shadow hover:bg-green-700 transition-all font-semibold flex items-center justify-center gap-2 hover:shadow-lg"
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
              </div>
            </div>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1 || loading}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </button>

          <span className="text-sm font-medium text-gray-600">
            Showing results for Page {page}
          </span>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            // Disable if less than limit, assuming end of data
            disabled={batches.length < LIMIT || loading}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
