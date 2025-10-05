import React, { useState } from "react";
import { Wallet, DollarSign, Clock, CheckCircle2 } from "lucide-react";
import StatusDisplay from "./StatusDisplay";

const PaymentWithdraw = () => {
  const [withdrawalStatus, setWithdrawalStatus] = useState(null);

  const showStatus = (message, isSuccess = false, loading = false) => {
    setWithdrawalStatus({ message, isSuccess, loading });
    if (!loading) {
      setTimeout(() => setWithdrawalStatus(null), 5000);
    }
  };

  const handleWithdrawal = (e) => {
    e.preventDefault();
    const amount = parseFloat(e.target.withdrawAmount.value);

    if (!amount || amount < 100) {
      showStatus("❌ Please enter a valid withdrawal amount (min ₹100).", false);
      return;
    }

    // Simulate blockchain or UPI payout
    showStatus(`Processing withdrawal of ₹${amount}...`, true, true);
    setTimeout(() => {
      showStatus(
        `✅ Withdrawal of ₹${amount} successfully initiated! Transaction sent to bank.`,
        true
      );
      e.target.reset();
    }, 2500);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-semibold text-emerald-800 mb-6 flex items-center gap-2">
        <Wallet size={22} /> 5. Payment Withdrawals
      </h2>

      <p className="text-gray-600 mb-6">
        Manage and withdraw your verified lab payments. All transactions are
        recorded securely on-chain.
      </p>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-green-50 p-6 rounded-xl border border-green-200 text-center shadow-sm">
          <DollarSign size={36} className="mx-auto text-green-600 mb-2" />
          <p className="text-4xl font-bold text-green-800">₹ 45,200</p>
          <p className="text-sm text-gray-600 mt-1 font-medium">
            Pending Balance
          </p>
        </div>
        <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 text-center shadow-sm">
          <Clock size={36} className="mx-auto text-amber-600 mb-2" />
          <p className="text-4xl font-bold text-amber-800">₹ 1,200</p>
          <p className="text-sm text-gray-600 mt-1 font-medium">
            Fees Deducted (Last Month)
          </p>
        </div>
      </div>

      {/* Withdrawal Form */}
      <form onSubmit={handleWithdrawal}>
        <div className="mb-4">
          <label
            htmlFor="withdrawAmount"
            className="block text-sm font-medium text-emerald-900 mb-1"
          >
            <Wallet size={16} className="inline mr-2" /> Amount to Withdraw (INR)
          </label>
          <input
            type="number"
            id="withdrawAmount"
            name="withdrawAmount"
            placeholder="e.g., 5000"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold flex items-center justify-center"
        >
          <DollarSign size={18} className="mr-2" /> Initiate Withdrawal via
          UPI/Bank
        </button>
      </form>

      <StatusDisplay status={withdrawalStatus} />

      {/* Transaction History */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-emerald-800 mb-3 flex items-center gap-2">
          <CheckCircle2 size={18} /> Recent Transactions
        </h3>
        <div className="overflow-x-auto bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                {["Date", "Transaction ID", "Amount", "Status"].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left font-medium tracking-wide"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  date: "2025-10-03",
                  id: "TXN9F8A23",
                  amount: "₹ 20,000",
                  status: "Completed",
                },
                {
                  date: "2025-09-20",
                  id: "TXN7A6B51",
                  amount: "₹ 10,000",
                  status: "Completed",
                },
                {
                  date: "2025-09-10",
                  id: "TXN4D2C19",
                  amount: "₹ 5,000",
                  status: "Pending",
                },
              ].map((txn) => (
                <tr key={txn.id} className="border-t">
                  <td className="px-6 py-3 text-gray-700">{txn.date}</td>
                  <td className="px-6 py-3 text-gray-600">{txn.id}</td>
                  <td className="px-6 py-3 text-gray-800 font-semibold">
                    {txn.amount}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        txn.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentWithdraw;
