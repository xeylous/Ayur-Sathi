"use client";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Activity, BarChart2, Clock, CheckCircle, XCircle } from "lucide-react";

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

      {/* 📊 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* 📅 Monthly Bar Chart */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-emerald-900 mb-4">
            Monthly Certifications Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyCertifications}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="approved" fill={COLORS.approved} name="Approved" />
              <Bar dataKey="rejected" fill={COLORS.rejected} name="Rejected" />
             
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 🥧 Pie Chart */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-emerald-900 mb-4">
            Certification Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {distribution.map((entry, index) => {
                  let fillColor = COLORS.approved;
                  if (entry.name === "Rejected") fillColor = COLORS.rejected;
                  if (entry.name === "Pending") fillColor = COLORS.pending;
                  return <Cell key={`cell-${index}`} fill={fillColor} />;
                })}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📈 Line Chart */}
      <div className="mt-10 p-6 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold text-emerald-900 mb-4">
          Certification Trend (Approved vs Rejected )
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyCertifications}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="approved"
              stroke={COLORS.approved}
              strokeWidth={3}
              dot={{ r: 5 }}
              name="Approved"
            />
            <Line
              type="monotone"
              dataKey="rejected"
              stroke={COLORS.rejected}
              strokeWidth={3}
              dot={{ r: 5 }}
              name="Rejected"
            />
           
          </LineChart>
        </ResponsiveContainer>
      </div>

      <StatusDisplay status={status} />
    </div>
  );
};

export default Analytics;
