import { useState } from "react";
import { Search, CheckCircle, XCircle, FileText, ExternalLink } from "lucide-react";

export default function BatchVerification({ showToast }) {
  const [batchId, setBatchId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ⚙️ CONFIG: The status required to enable the Accept/Decline buttons
  // Change this to "Quality Passed" or whatever your logic requires
  const TARGET_STATUS = "Approved"; 

  // 🔍 Fetch batch details from backend
  const fetchBatch = async () => {
    if (!batchId) return showToast("Enter Batch ID.", "error");

    setLoading(true);

    try {
      const res = await fetch(`/api/manufacture?batchId=${batchId}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!data.success) {
        showToast(data.message, "error");
        setResult(null);
        setLoading(false);
        return;
      }

      setResult({
        id: data.data.batchId,
        status: data.data.status,
        quantity: data.data.quantity,
        certificate: data.data.certificate?.url || null, // Handle null gracefully
        speciesId: data.data.speciesId,
      });

      showToast(`Batch ${batchId} fetched successfully.`, "success");
    } catch (err) {
      showToast("Something went wrong while fetching batch.", "error");
    }

    setLoading(false);
  };

  // ✅ Accept / Decline batch
  const handleAction = async (action) => {
    if (!result) return showToast("Fetch batch first.", "error");

    setLoading(true);

    try {
      const res = await fetch(`/api/manufacture`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchId,
          action,
          manuOperatorName: "Default Operator",
        }),
      });

      const data = await res.json();

      if (!data.success) {
        showToast(data.message, "error");
      } else {
        showToast(
          action === "Accept"
            ? `Batch ${batchId} accepted.`
            : `Batch ${batchId} declined.`,
          action === "Accept" ? "success" : "error"
        );
        // Clear result or update status locally to reflect change immediately
        setResult(null);
        setBatchId("");
      }
    } catch (err) {
      showToast("Action failed. Try again.", "error");
    }

    setLoading(false);
  };

  // 📄 Open Certificate in Popup
  const openCertificate = () => {
    if (result?.certificate) {
      // Opens a new small window (popup browser)
      window.open(
        result.certificate,
        "CertificateWindow",
        "width=800,height=900,scrollbars=yes,resizable=yes"
      );
    } else {
      showToast("No certificate URL available.", "error");
    }
  };
  const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case "Approved":
      return "bg-green-100 text-green-700 border border-green-300";
    case "Pending":
      return "bg-yellow-100 text-yellow-700 border border-yellow-300";
    case "Rejected":
      return "bg-red-100 text-red-700 border border-red-300";
    default:
      return "bg-gray-200 text-gray-600 border border-gray-300";
  }
};

  // 🔒 Logic: Check if buttons should be enabled
  // Buttons are disabled if loading, no result, OR status is not the target status
  const isActionAllowed = result && result.status === TARGET_STATUS;

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6 text-green-700">
        Batch Verification
      </h3>

      <div className="bg-white p-6 rounded-2xl shadow-xl">
        {/* 1. Fixed Fetch Button Layout */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
          <input
            type="text"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            placeholder="Enter Batch ID..."
            className="flex-grow p-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500"
          />
          <button
            onClick={fetchBatch}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center justify-center disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            <Search className="w-5 h-5 mr-2" /> {loading ? "Loading..." : "Fetch"}
          </button>
        </div>

        {/* Info Display */}
        <div className="min-h-[100px] bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 mb-6">
          {result ? (
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xl font-semibold text-gray-800">
                    Batch ID: {result.id}
                  </p>
                  <p className="text-gray-600 mt-1">
                    <span className="font-medium">Status: </span> 
 <span className={`font-bold ${result.status === TARGET_STATUS ? getStatusClass(result.status) : ""}`}>

                      {result.status}
                    </span>
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Species:</span> {result.speciesId}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Quantity:</span> {result.quantity}
                  </p>
                </div>
              </div>

              {/* 3. Certificate Button instead of URL */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-600 font-medium mb-2">Certificate:</p>
                {result.certificate ? (
                  <button
                    onClick={openCertificate}
                    className="flex items-center bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg border border-blue-200 transition-colors"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Certificate
                    <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
                  </button>
                ) : (
                  <span className="text-gray-400 italic">No Certificate Uploaded</span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic text-center py-4">
              Batch details will appear here after fetching.
            </p>
          )}
        </div>

        {/* 2. Conditional Action Buttons */}
        <div className="flex flex-col space-y-3">
          <div className="flex space-x-4">
            <button
              onClick={() => handleAction("Accept")}
              // Disable if loading, no result, or Status is NOT "Pending"
              disabled={!isActionAllowed || loading}
              className={`flex-grow font-bold p-4 rounded-xl flex items-center justify-center transition-all ${
                !isActionAllowed || loading 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-xl"
              }`}
            >
              <CheckCircle className="w-6 h-6 mr-2" /> Accept
            </button>
            
            <button
              onClick={() => handleAction("Decline")}
              disabled={!isActionAllowed || loading}
              className={`flex-grow font-bold p-4 rounded-xl flex items-center justify-center transition-all ${
                !isActionAllowed || loading 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-xl"
              }`}
            >
              <XCircle className="w-6 h-6 mr-2" /> Decline
            </button>
          </div>
          
          {/* Explanation text if disabled */}
          {result && !isActionAllowed && (
            <p className="text-center text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg">
              ⚠️ Cannot perform actions: This batch is currently "{result.status}". 
              Actions are only allowed when status is "{TARGET_STATUS}".
            </p>
          )}
        </div>
      </div>
    </div>
  );
}