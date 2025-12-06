"use client";
import { TrendingUp, CheckCircle, DollarSign, Clock, FileText } from "lucide-react";
import StatCard from "./StatCard";

const Dashboard = ({ batches, users, manufacturer = [], setActiveTab }) => {
  const pendingLabs = users.filter(
    (u) => u.role === "Laboratory" && u.status === "Pending Approval"
  ).length;

  const pendingPayments = batches.filter(
    (b) => b.paymentStatus === "Pending" && b.qaStatus === "Lab Approved"
  ).length;

  const pendingListings = batches.filter(
    (b) => b.paymentStatus === "Paid" && b.marketplaceStatus === "Pending Admin Approval"
  ).length;

  const pendingManufacturers = manufacturer.filter(
    (m) => m.role === "Manufacturer" && m.status === "Pending Approval"
  ).length;

  return (
    <>
      <h2 className="text-3xl font-extrabold text-indigo-800 mb-6">System Overview</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={TrendingUp}
          title="Total Batches"
          value={batches.length}
          color="bg-teal-100 text-teal-800"
        />
        <StatCard
          icon={CheckCircle}
          title="Certified & Live"
          value={batches.filter((b) => b.marketplaceStatus === "Live").length}
          color="bg-green-100 text-green-800"
        />
        <StatCard
          icon={DollarSign}
          title="Total Paid Out"
          value="₹ 4.5M"
          color="bg-indigo-100 text-indigo-800"
        />
        <StatCard
          icon={Clock}
          title="Pending Payments"
          value={pendingPayments}
          color="bg-amber-100 text-amber-800"
        />
      </div>

      {/* Action Required Section */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center">
          <FileText size={20} className="mr-2" /> Action Required
        </h3>

        <ul className="space-y-3">
          <li className="p-3 bg-red-50 rounded-lg flex justify-between items-center text-red-800">
            <span className="font-medium">
              {pendingLabs} Laboratory registration(s) require approval.
            </span>
            <button
              onClick={() => setActiveTab("user")}
              className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
            >
              Review Labs &rarr;
            </button>
          </li>

          <li className="p-3 bg-amber-50 rounded-lg flex justify-between items-center text-amber-800">
            <span className="font-medium">
              {pendingPayments} Batches ready for Farmer Payment disbursement.
            </span>
            <button
              onClick={() => setActiveTab("farmerPayment")}
              className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
            >
              Pay Farmers &rarr;
            </button>
          </li>

          <li className="p-3 bg-blue-50 rounded-lg flex justify-between items-center text-blue-800">
            <span className="font-medium">
              {pendingListings} Batches ready for final Marketplace listing.
            </span>
            <button
              onClick={() => setActiveTab("laboratory")}
              className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
            >
              List Herbs &rarr;
            </button>
          </li>

          <li className="p-3 bg-purple-50 rounded-lg flex justify-between items-center text-purple-800">
            <span className="font-medium">
              {pendingManufacturers} Manufacturer registration(s) require approval.
            </span>
            <button
              onClick={() => setActiveTab("manufacturer")}
              className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
            >
              Review Manufacturers &rarr;
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Dashboard;
