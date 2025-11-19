"use client";
import React, { useState, useEffect } from "react";
import { speciesList } from "@/lib/cropdetails";
import { Search, CheckCircle, XCircle, QrCode, Filter } from "lucide-react";
import StatusDisplay from "./StatusDisplay";

const CertifiedBatches = () => {
  const [certifiedBatches, setCertifiedBatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [statusMessage, setStatusMessage] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  // ✅ Fetch certified batches
  const fetchCertifiedBatches = async (pageNumber = 1) => {
    try {
      setStatusMessage({
        message: pageNumber === 1 ? "Loading certified batches..." : "Loading more...",
        loading: true,
      });

      const res = await fetch(`/api/certified-batch?page=${pageNumber}&limit=${limit}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        if (pageNumber === 1) {
          setCertifiedBatches(data.data);
        } else {
          setCertifiedBatches((prev) => [...prev, ...data.data]);
        }

        // ✅ Hide load more when no more data
        const totalLoaded = (pageNumber - 1) * limit + data.data.length;
        setHasMore(totalLoaded < data.totalCount);

        setStatusMessage({
          message: "Certified batches loaded successfully!",
          isSuccess: true,
        });
      } else {
        setStatusMessage({
          message: data.message || "Failed to load certified batches.",
          isSuccess: false,
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setStatusMessage({
        message: "Server error while fetching batches.",
        isSuccess: false,
      });
    } finally {
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  // ✅ Initial fetch
  useEffect(() => {
    fetchCertifiedBatches(1);
  }, []);

  // ✅ Find herb name
  const getHerbName = (speciesId) => {
    const herb = speciesList.find((item) => item.speciesId === speciesId);
    return herb ? herb.name : "Unknown Herb";
  };

  // 🔍 Filter + Search
  const filtered = certifiedBatches.filter((batch) => {
    const herbName = getHerbName(batch.speciesId);

    const matchesSearch =
      searchTerm === "" ||
      batch.batchId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      herbName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.uniqueId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all"
        ? true
        : filterStatus === "approved"
        ? batch.status === "Approved"
        : filterStatus === "rejected"
        ? batch.status === "Rejected"
        : true;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-semibold text-emerald-800 mb-4 flex items-center gap-2">
        <QrCode size={22} /> Certified Batches
      </h2>

      {/* 🔎 Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 flex items-center border border-gray-300 rounded-lg px-3">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by batch ID, herb, or farmer ID..."
            className="w-full p-2 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* 📋 Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-sm border border-gray-200">
          <thead className="bg-emerald-900 text-white text-left text-sm uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Batch ID</th>
              <th className="py-3 px-4">Herb</th>
              <th className="py-3 px-4">Farmer ID</th>
              <th className="py-3 px-4">Certified Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Certificate</th>
              <th className="py-3 px-4">Blockchain Hash</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No certified batches found.
                </td>
              </tr>
            ) : (
              filtered.map((batch) => (
                <tr
                  key={batch._id}
                  className="border-t hover:bg-teal-50 transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-gray-800">
                    {batch.batchId}
                  </td>

                  <td className="py-3 px-4">{getHerbName(batch.speciesId)}</td>

                  <td className="py-3 px-4">{batch.uniqueId || "N/A"}</td>

                  <td className="py-3 px-4 text-gray-600">
                    {batch.updatedAt
                      ? new Date(batch.updatedAt).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="py-3 px-4">
                    {batch.status === "Approved" ? (
                      <span className="flex items-center text-green-700 font-semibold">
                        <CheckCircle size={16} className="mr-1" /> Approved
                      </span>
                    ) : batch.status === "Rejected" ? (
                      <span className="flex items-center text-red-600 font-semibold">
                        <XCircle size={16} className="mr-1" /> Rejected
                      </span>
                    ) : (
                      <span className="text-amber-600 font-semibold">
                        Verified
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-blue-700 font-semibold">
                    {batch.certificate?.url ? (
                      <a
                        href={batch.certificate.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        View PDF
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="py-3 px-4 text-gray-600">
                    {batch.blockchainHash || "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔘 Load More Button */}
      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={() => {
              const nextPage = page + 1;
              setPage(nextPage);
              fetchCertifiedBatches(nextPage);
            }}
            className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
          >
            Load More
          </button>
        </div>
      )}

      <StatusDisplay status={statusMessage} />
    </div>
  );
};

export default CertifiedBatches;
