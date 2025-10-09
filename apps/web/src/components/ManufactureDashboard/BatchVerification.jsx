import { useState } from "react";
import { Search, CheckCircle, XCircle } from "lucide-react";

export default function BatchVerification({ showToast }) {
  const [batchId, setBatchId] = useState("");
  const [result, setResult] = useState(null);

  const fetchBatch = () => {
    if (!batchId) return showToast("Enter Batch ID.", "error");
    setResult({
      id: batchId,
      status: "Pending Lab Review",
      product: "Compound X-75",
      quantity: "5,000 kg",
      note: "Minor purity variance detected.",
    });
    showToast(`Batch ${batchId} fetched.`, "info");
  };

  const handleAction = (action) => {
    if (!result) return showToast("Fetch batch first.", "error");
    showToast(
      action === "Accept"
        ? `Batch ${batchId} accepted.`
        : `Batch ${batchId} declined.`,
      action === "Accept" ? "success" : "error"
    );
    setBatchId("");
    setResult(null);
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6 text-green-700">
        Batch Verification
      </h3>
      <div className="bg-white p-6 rounded-2xl shadow-xl">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-x-4 mb-8">
          <input
            type="text"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            placeholder="Enter Batch ID..."
            className="flex-grow p-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500"
          />
          <button
            onClick={fetchBatch}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center justify-center"
          >
            <Search className="w-5 h-5 mr-2" /> Fetch
          </button>
        </div>

        <div className="min-h-[100px] bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 mb-6">
          {result ? (
            <div>
              <p className="text-xl font-semibold text-gray-800">
                Batch ID: {result.id}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Status:</span> {result.status}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Product:</span> {result.product}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Quantity:</span> {result.quantity}
              </p>
              <p className="text-gray-600 italic text-yellow-700">
                {result.note}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 italic">
              Batch details will appear here after fetching.
            </p>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => handleAction("Accept")}
            className="flex-grow bg-green-500 text-white font-bold p-4 rounded-xl flex items-center justify-center"
          >
            <CheckCircle className="w-6 h-6 mr-2" /> Accept
          </button>
          <button
            onClick={() => handleAction("Decline")}
            className="flex-grow bg-red-500 text-white font-bold p-4 rounded-xl flex items-center justify-center"
          >
            <XCircle className="w-6 h-6 mr-2" /> Decline
          </button>
        </div>
      </div>
    </div>
  );
}
