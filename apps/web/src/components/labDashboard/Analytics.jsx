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
import StatusDisplay from "./StatusDisplay";

// 🎨 Chart colors
const COLORS = ["#10B981", "#F59E0B", "#EF4444", "#3B82F6"];

// 📊 Mock analytics data
const mockData = {
  monthlyCertifications: [
    { month: "Jan", approved: 8, rejected: 1 },
    { month: "Feb", approved: 12, rejected: 3 },
    { month: "Mar", approved: 10, rejected: 2 },
    { month: "Apr", approved: 14, rejected: 1 },
    { month: "May", approved: 18, rejected: 2 },
    { month: "Jun", approved: 15, rejected: 4 },
    { month: "Jul", approved: 20, rejected: 3 },
    { month: "Aug", approved: 22, rejected: 1 },
    { month: "Sep", approved: 25, rejected: 2 },
  ],
  totalStats: {
    totalBatches: 250,
    approved: 200,
    rejected: 40,
    pending: 10,
  },
  distribution: [
    { name: "Approved", value: 200 },
    { name: "Rejected", value: 40 },
    { name: "Pending", value: 10 },
  ],
};

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // Simulate data fetch delay
    setStatus({ message: "Fetching analytics data...", loading: true });
    setTimeout(() => {
      setAnalyticsData(mockData);
      setStatus({
        message: "Analytics data loaded successfully!",
        isSuccess: true,
      });
      setTimeout(() => setStatus(null), 3000);
    }, 1200);
  }, []);

  if (!analyticsData) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-semibold text-emerald-800 mb-4 flex items-center gap-2">
          <BarChart2 size={22} /> 4. Analytics Dashboard
        </h2>
        <StatusDisplay status={status} />
      </div>
    );
  }

  const { monthlyCertifications, totalStats, distribution } = analyticsData;

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-semibold text-emerald-800 mb-6 flex items-center gap-2">
        <Activity size={22} /> 4. Analytics Dashboard
      </h2>

      {/* Top summary cards */}
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
        <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-xl text-center shadow-sm">
          <h3 className="text-lg font-bold text-yellow-800 flex justify-center items-center gap-2">
            <Clock size={18} /> Pending
          </h3>
          <p className="text-3xl font-extrabold text-yellow-700">
            {totalStats.pending}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Monthly Certifications (Bar Chart) */}
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
              <Bar dataKey="approved" fill="#10B981" name="Approved" />
              <Bar dataKey="rejected" fill="#EF4444" name="Rejected" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution Pie Chart */}
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
                fill="#10B981"
                label
              >
                {distribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart (trend) */}
      <div className="mt-10 p-6 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold text-emerald-900 mb-4">
          Certification Trend (Approved vs Rejected)
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
              stroke="#10B981"
              strokeWidth={3}
              dot={{ r: 5 }}
              name="Approved"
            />
            <Line
              type="monotone"
              dataKey="rejected"
              stroke="#EF4444"
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
