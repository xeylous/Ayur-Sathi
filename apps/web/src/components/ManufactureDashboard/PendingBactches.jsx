import { useState, useEffect } from "react";
import { 
  FileText, 
  ExternalLink, 
  Loader2, 
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Info,
  Search // Kept only for the empty state icon
} from "lucide-react";

export default function PendingBatchManager({ showToast }) {
  // --- States for Pending List ---
  const [pendingList, setPendingList] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [page, setPage] = useState(1);

  // --- States for Single Batch Details ---
  const [batchId, setBatchId] = useState("");
  const [result, setResult] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // ---------------------------------------------------------
  // 1️⃣ FETCH PENDING LIST
  // ---------------------------------------------------------
  const fetchPendingBatches = async () => {
    setListLoading(true);
    try {
      const res = await fetch(`/api/manufacture/pending?page=${page}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      
      if (data.success) {
        setPendingList(data.data || []); 
      } else {
        console.error("Failed to load list");
        setPendingList([]);
      }
    } catch (error) {
      console.error("Error fetching pending list:", error);
      setPendingList([]);
    }
    setListLoading(false);
  };

  useEffect(() => {
    fetchPendingBatches();
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    // Basic logic: if we have items, assume there might be a next page.
    // Ideally, backend should return 'totalPages' or 'hasNextPage'.
    if (pendingList.length > 0) setPage((prev) => prev + 1);
  };

  // ---------------------------------------------------------
  // 2️⃣ FETCH SINGLE BATCH DETAILS
  // ---------------------------------------------------------
  const fetchBatchDetails = async (idToFetch) => {
    const targetId = idToFetch || batchId; 
    if (!targetId) return showToast("Enter Batch ID.", "error");

    setDetailLoading(true);
    if (idToFetch) setBatchId(idToFetch); 

    try {
      const res = await fetch(`/api/manufacture?batchId=${targetId}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!data.success) {
        showToast(data.message, "error");
        setResult(null);
      } else {
        setResult({
          id: data.data.batchId,
          status: data.data.status,
          quantity: data.data.quantity,
          certificate: data.data.certificate?.url || null,
          speciesId: data.data.speciesId,
        });
      }
    } catch (err) {
      showToast("Error fetching batch details.", "error");
    }
    setDetailLoading(false);
  };

  // ---------------------------------------------------------
  // 3️⃣ UTILS
  // ---------------------------------------------------------
  const openCertificate = () => {
    if (result?.certificate) {
      window.open(result.certificate, "CertWindow", "width=800,height=900,scrollbars=yes,resizable=yes");
    } else {
      showToast("No certificate available.", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold text-gray-800">Pending Batches</h2>
            <p className="text-gray-500 text-sm mt-1">Select a batch to view details and certificate.</p>
        </div>
        <button 
          onClick={fetchPendingBatches} 
          className="text-gray-500 hover:text-green-600 transition-colors p-2 bg-white rounded-full shadow-sm border border-gray-200"
          title="Refresh List"
        >
          <RefreshCw className={`w-5 h-5 ${listLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 📋 LEFT COLUMN: PENDING LIST */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col h-[600px]">
          
          {/* Header Title for List */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
            <h3 className="font-semibold text-gray-700">Batch List</h3>
            <span className="text-xs text-gray-400 font-mono">Page {page}</span>
          </div>

          {/* List Content */}
          <div className="flex-grow overflow-y-auto p-2 space-y-2">
            {listLoading ? (
              <div className="flex justify-center items-center h-40 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : pendingList.length > 0 ? (
              pendingList.map((item, index) => (
                <div
                  key={index}
                  onClick={() => fetchBatchDetails(item.batchId)}
                  className={`group p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                    result?.id === item.batchId 
                      ? "bg-green-50 border-green-500 ring-1 ring-green-500" 
                      : "bg-white border-gray-100 hover:border-green-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                            {item.status || "Pending"}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-800 mt-2">ID: {item.batchId}</h4>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-gray-300 group-hover:text-green-500 transition-colors ${result?.id === item.batchId ? "text-green-600" : ""}`} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 mt-10">
                <p>No batches found on this page.</p>
              </div>
            )}
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-between items-center">
            <button
              onClick={handlePrevPage}
              disabled={page === 1 || listLoading}
              className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
            </button>
            
            <span className="text-sm font-medium text-gray-600">Page {page}</span>

            <button
              onClick={handleNextPage}
              // Disable Next if list is empty (assuming end of data) or loading
              disabled={pendingList.length === 0 || listLoading}
              className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* 🔍 RIGHT COLUMN: DETAILS VIEW ONLY */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 h-full">
            
            <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
               Batch Details
            </h3>

            {/* Manual Fetch Bar (Optional) */}
            <div className="flex space-x-3 mb-6">
              <input
                type="text"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                placeholder="Or enter Batch ID manually..."
                className="flex-grow p-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500"
              />
              <button
                onClick={() => fetchBatchDetails(null)}
                disabled={detailLoading}
                className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-xl disabled:opacity-50"
              >
                {detailLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : "Fetch"}
              </button>
            </div>

            {/* Details Card */}
            <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-8 min-h-[300px] relative">
              {detailLoading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
                   <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
                </div>
              )}

              {result ? (
                <div className="space-y-6">
                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                       <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Batch ID</p>
                       <p className="text-2xl font-bold text-gray-800">{result.id}</p>
                    </div>
                    <div>
                       <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Current Status</p>
                       <span className="inline-block mt-1 px-3 py-1 rounded-full text-sm font-bold bg-yellow-100 text-yellow-700">
                         {result.status}
                       </span>
                    </div>
                    <div>
                       <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Species ID</p>
                       <p className="text-lg text-gray-700">{result.speciesId}</p>
                    </div>
                    <div>
                       <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Quantity</p>
                       <p className="text-lg text-gray-700">{result.quantity}</p>
                    </div>
                  </div>

                  {/* Certificate Section */}
                  <div className="pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-3">Documents</p>
                    {result.certificate ? (
                      <button
                        onClick={openCertificate}
                        className="flex items-center space-x-2 text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg border border-blue-200 transition-all"
                      >
                        <FileText className="w-4 h-4" />
                        <span className="font-medium">View Quality Certificate</span>
                        <ExternalLink className="w-3 h-3 opacity-50" />
                      </button>
                    ) : (
                       <span className="text-gray-400 italic">No certificate uploaded</span>
                    )}
                  </div>

                  <div className="pt-4 mt-4 bg-blue-50 p-4 rounded-lg flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-700">
                        This view is read-only. To approve or decline this batch, please navigate to the Verification module.
                    </p>
                  </div>

                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <Search className="w-12 h-12 mb-3 opacity-20" />
                  <p>Select a batch from the list to view details.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}