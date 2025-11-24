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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-[600px] max-h-[85vh] overflow-y-auto rounded-2xl shadow-xl p-6 relative">
              {/* Close Button */}
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
                onClick={() => setShowDetails(false)}
              >
                ✖
              </button>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Batch Details — {selectedBatch.batchId}
              </h3>

              <div className="space-y-3 text-gray-700 text-sm">
                <p>
                  <strong>Species:</strong> {selectedBatch.speciesId}
                </p>
                <p>
                  <strong>Quantity:</strong> {selectedBatch.quantity} units
                </p>
                <p>
                  <strong>Status:</strong> {selectedBatch.status}
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
                <div className="text-center">
                  <p className="font-semibold mb-2">QR Code</p>
                  <img
                    src={selectedBatch.qrCode?.url}
                    className="mx-auto w-40 border rounded-lg"
                  />
                </div>

                {/* Certificate Download */}
                <div className="mt-6 flex flex-col gap-4 items-center">
                  {/* QR Download Button */}
                  {selectedBatch.qrCode?.url && (
                    <button
                      onClick={() =>
                        downloadFile(
                          selectedBatch.qrCode.url,
                          `${selectedBatch.batchId}_QR.png`
                        )
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-all"
                    >
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
                      className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition-all"
                    >
                      Download Certificate
                    </button>
                  )}
                </div>

                {/* Processing Steps */}
                {selectedBatch.manufacturingProcesses?.length > 0 && (
                  <div className="mt-5">
                    <h4 className="font-bold text-lg mb-2">Processing Steps</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      {selectedBatch.manufacturingProcesses.map((step, i) => (
                        <li key={i}>
                          <strong>{step.processName}</strong>.
                          <br />
                        </li>
                      ))}
                    </ul>
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
