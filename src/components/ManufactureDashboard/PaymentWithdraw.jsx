"use client";
import { useState } from "react";

export default function PaymentWithdraw({ showToast }) {
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!account)
      return setMessage({
        text: "Please select a destination account.",
        type: "error",
      });

    setMessage({
      text: `Success! Withdrawal of $${parseFloat(amount).toFixed(
        2
      )} to account ${account} has been submitted.`,
      type: "success",
    });
    showToast("Withdrawal submitted successfully.", "success");
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6 text-green-700">
        Payment Withdraw
      </h3>
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl max-w-xl">
        <div className="mb-6">
          <p className="text-lg font-medium text-gray-700 mb-2">
            Current Balance
          </p>
          <p className="text-4xl font-extrabold text-green-600">$4,520.50</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Withdrawal Amount ($)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 500.00"
            min="1"
            max="4520.50"
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 mb-4"
          />

          <label
            htmlFor="account"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Destination Account
          </label>
          <select
            id="account"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 mb-6 bg-white"
          >
            <option value="">Select Bank Account</option>
            <option value="bank1">Bank of America (***1234)</option>
            <option value="bank2">Wells Fargo (***5678)</option>
            <option value="crypto">Crypto Wallet (BTC)</option>
          </select>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3 rounded-xl transition-all shadow-md active:scale-95"
          >
            Submit Withdrawal Request
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 rounded-xl text-sm font-medium ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
