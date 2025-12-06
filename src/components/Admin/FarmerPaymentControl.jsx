"use client";
import { DollarSign } from "lucide-react";

const FarmerPaymentControl = ({ batches, setBatches, setStatusMessage }) => {
  const handleFarmerPayment = (batchId) => {
    setBatches((prev) =>
      prev.map((b) =>
        b.id === batchId ? { ...b, paymentStatus: "Paid" } : b
      )
    );
    setStatusMessage({
      message: "Farmer Payment released successfully",
      isSuccess: true,
    });
  };

  const pendingPayments = batches.filter(
    (b) => b.paymentStatus === "Pending" && b.qaStatus === "Lab Approved"
  );

  return (
    <>
      <h2 className="text-3xl font-extrabold text-indigo-800 mb-6">
        Farmer Payment Disbursement
      </h2>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-indigo-800 mb-4">
          Pending Farmer Payments
        </h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-indigo-100 text-indigo-800 text-left">
              <th className="p-3">Batch ID</th>
              <th className="p-3">Farmer ID</th>
              <th className="p-3">Herb</th>
              <th className="p-3">Price</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingPayments.map((b) => (
              <tr key={b.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{b.id}</td>
                <td className="p-3">{b.farmerId}</td>
                <td className="p-3">{b.herb}</td>
                <td className="p-3">₹ {b.price}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleFarmerPayment(b.id)}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 flex items-center gap-1"
                  >
                    <DollarSign size={14} /> Release Payment
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

export default FarmerPaymentControl;
