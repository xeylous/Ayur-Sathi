"use client";
import React, { useState, useEffect } from "react";
import { Activity, BarChart2, Clock, CheckCircle, XCircle, TrendingUp, Calendar } from "lucide-react";

// 🎨 Colors
const COLORS = {
  approved: "#10B981", // green
  rejected: "#EF4444", // red
  pending: "#3B82F6", // blue
};

// 🧩 Status message component
const StatusDisplay = ({ status }) => {
  if (!status) return null;
  return (
    <div
      className={`mt-4 text-center p-3 rounded-md ${
        status.loading
          ? "bg-blue-100 text-blue-800"
          : status.isSuccess
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {status.message}
    </div>
  );
};

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setStatus({ message: "Fetching analytics data...", loading: true });
        const res = await fetch("/api/analytics", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setAnalyticsData(data.data);
          setStatus({
            message: "Analytics data loaded successfully!",
            isSuccess: true,
          });
          setTimeout(() => setStatus(null), 3000);
        } else {
          setStatus({
            message: data.message || "Failed to fetch analytics.",
            isError: true,
          });
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setStatus({ message: "Error loading analytics.", isError: true });
      }
    };

    fetchAnalytics();
  }, []);

  if (!analyticsData) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-semibold text-emerald-800 mb-4 flex items-center gap-2">
          <BarChart2 size={22} /> Analytics Dashboard
        </h2>
        <StatusDisplay status={status} />
      </div>
    );
  }

  const { monthlyCertifications, totalStats, distribution } = analyticsData;

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-semibold text-emerald-800 mb-6 flex items-center gap-2">
        <Activity size={22} /> Analytics Dashboard
      </h2>

      {/* 📦 Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-teal-50 border border-teal-200 p-5 rounded-xl text-center shadow-sm">
          <h3 className="text-lg font-bold text-teal-800">Total Batches</h3>
          <p className="text-3xl font-extrabold text-teal-700">
            {totalStats.totalBatches}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 p-5 rounded-xl text-center shadow-sm">
          <h3 className="text-lg font-bold text-green-800 flex justify-center items-center gap-2">
            <CheckCircle size={18} /> Approved
          </h3>
          <p className="text-3xl font-extrabold text-green-700">
            {totalStats.approved}
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 p-5 rounded-xl text-center shadow-sm">
          <h3 className="text-lg font-bold text-red-800 flex justify-center items-center gap-2">
            <XCircle size={18} /> Rejected
          </h3>
          <p className="text-3xl font-extrabold text-red-700">
            {totalStats.rejected}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl text-center shadow-sm">
          <h3 className="text-lg font-bold text-blue-800 flex justify-center items-center gap-2">
            <Clock size={18} /> Pending
          </h3>
          <p className="text-3xl font-extrabold text-blue-700">
            {totalStats.pending}
          </p>
        </div>
      </div>

      {/* 📊 Monthly Certifications */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
          <Calendar size={20} />
          Monthly Certifications Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {monthlyCertifications.map((month, index) => (
            <div key={index} className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
              <h4 className="text-lg font-bold text-gray-800 mb-3">{month.month}</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <CheckCircle size={16} className="text-green-600" />
                    Approved
                  </span>
                  <span className="text-lg font-bold text-green-700">{month.approved}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <XCircle size={16} className="text-red-600" />
                    Rejected
                  </span>
                  <span className="text-lg font-bold text-red-700">{month.rejected}</span>
                </div>
                <div className="pt-2 border-t border-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">Total</span>
                    <span className="text-lg font-bold text-gray-900">{month.approved + month.rejected}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📈 Distribution Summary */}
      <div className="mt-10 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl shadow-sm">
        <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
          <TrendingUp size={20} />
          Certification Status Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {distribution.map((item, index) => {
            let bgColor = "bg-green-100";
            let textColor = "text-green-800";
            let borderColor = "border-green-300";
            let icon = <CheckCircle size={24} />;

            if (item.name === "Rejected") {
              bgColor = "bg-red-100";
              textColor = "text-red-800";
              borderColor = "border-red-300";
              icon = <XCircle size={24} />;
            } else if (item.name === "Pending") {
              bgColor = "bg-blue-100";
              textColor = "text-blue-800";
              borderColor = "border-blue-300";
              icon = <Clock size={24} />;
            }

            const percentage = totalStats.totalBatches > 0
              ? ((item.value / totalStats.totalBatches) * 100).toFixed(1)
              : 0;

            return (
              <div key={index} className={`p-6 ${bgColor} border-2 ${borderColor} rounded-xl text-center`}>
                <div className={`flex justify-center mb-3 ${textColor}`}>
                  {icon}
                </div>
                <h4 className={`text-lg font-bold ${textColor} mb-2`}>{item.name}</h4>
                <p className={`text-4xl font-extrabold ${textColor} mb-1`}>{item.value}</p>
                <p className={`text-sm font-medium ${textColor} opacity-80`}>{percentage}% of total</p>
              </div>
            );
          })}
        </div>
      </div>

      <StatusDisplay status={status} />
    </div>
  );
};

export default Analytics;
