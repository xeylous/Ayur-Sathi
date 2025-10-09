"use client";
import { CheckCircle, XCircle } from "lucide-react";

const LabMarketplaceControl = ({ batches, setBatches, setStatusMessage }) => {
  const handleMarketplaceApproval = (batchId, approve) => {
    setBatches((prev) =>
      prev.map((b) =>
        b.id === batchId
          ? { ...b, marketplaceStatus: approve ? "Live" : "Rejected" }
          : b
      )
    );
    setStatusMessage({
      message: `Marketplace listing ${approve ? "approved" : "rejected"}`,
      isSuccess: approve,
    });
  };

  const pendingListings = batches.filter(
    (b) => b.paymentStatus === "Paid" && b.marketplaceStatus === "Pending Admin Approval"
  );

  return (
    <>
      <h2 className="text-3xl font-extrabold text-indigo-800 mb-6">
        Marketplace Listing Control
      </h2>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-indigo-800 mb-4">
          Batches Pending Marketplace Approval
        </h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-indigo-100 text-indigo-800 text-left">
              <th className="p-3">Batch ID</th>
              <th className="p-3">Herb</th>
              <th className="p-3">Farmer ID</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingListings.map((b) => (
              <tr key={b.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{b.id}</td>
                <td className="p-3">{b.herb}</td>
                <td className="p-3">{b.farmerId}</td>
                <td className="p-3 text-amber-600">{b.marketplaceStatus}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleMarketplaceApproval(b.id, true)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button
                    onClick={() => handleMarketplaceApproval(b.id, false)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <XCircle size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LabMarketplaceControl;

