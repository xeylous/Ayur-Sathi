"use client";

import { useEffect, useState } from "react";
import { Clock, ChevronDown, ChevronUp, Image as ImageIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { speciesList } from "@/lib/cropdetails";
import { useCropCache } from "@/context/CropContext";

export default function CropHistory() {
  const pathname = usePathname();
  const uniqueId = pathname.split("/").pop();

  const { cachedCrops, setCachedCrops } = useCropCache();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch crop data (with caching for page 1)
  const fetchCrops = async (pageNumber = 1) => {
    // If cached page 1 exists → return it without fetching
    if (pageNumber === 1 && cachedCrops[uniqueId]?.page1) {
      setHistory(cachedCrops[uniqueId].page1);
      setTotalPages(cachedCrops[uniqueId].totalPages);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/crops/${uniqueId}?page=${pageNumber}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setHistory(data.data);
        setTotalPages(data.totalPages);

        // Cache only page 1
        if (pageNumber === 1) {
          setCachedCrops((prev) => ({
            ...prev,
            [uniqueId]: {
              page1: data.data,
              totalPages: data.totalPages
            }
          }));
        }
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error("Error fetching crops:", err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load (only once per uniqueId)
  useEffect(() => {
    if (uniqueId) fetchCrops(1);
  }, [uniqueId]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const changePage = (pageNum) => {
    setPage(pageNum);
    fetchCrops(pageNum);
  };

  // Sliding window for pagination
  const getPageNumbers = () => {
    let start = Math.max(1, page - 1);
    let end = Math.min(totalPages, start + 2);

    if (end - start < 2) start = Math.max(1, end - 2);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-2xl mt-6 md:mt-0 border border-[#90A955]/15">
      
      <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2 text-[#31572C]">
        <Clock className="w-6 h-6 text-[#90A955]" />
        Crop Upload History
      </h2>

      {loading ? (
        <p className="text-[#4F772D]/60 text-center py-8">Loading crop history...</p>
      ) : history.length === 0 ? (
        <p className="text-[#4F772D]/60 text-center py-8">No history available.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {history.map((item) => {
              const species = speciesList.find(
                (s) => s.speciesId === item.speciesId
              );
              const cropName = species ? species.name : item.speciesId;

              return (
                <li key={item._id} className="p-4 border rounded-xl bg-[#f8fae3]/30 border-[#90A955]/15 hover:border-[#90A955]/30 hover:bg-[#ECF39E]/10 transition-all">
                  
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleExpand(item._id)}
                  >
                    <div className="flex items-center gap-3">
                      {/* Crop image thumbnail */}
                      {item.cropImage?.url ? (
                        <img
                          src={item.cropImage.url}
                          alt={cropName}
                          className="w-10 h-10 rounded-lg object-cover border border-[#90A955]/20"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#90A955]/10 flex items-center justify-center border border-[#90A955]/15">
                          <ImageIcon className="w-4 h-4 text-[#90A955]/40" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-[#31572C]">{cropName}</p>
                        <p className="text-xs text-[#4F772D]/50">
                          {item.quantity} unit • {new Date(item.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.status === "Approved"
                            ? "bg-[#90A955]/15 text-[#4F772D] border border-[#90A955]/25"
                            : item.status === "Rejected"
                            ? "bg-red-50 text-red-600 border border-red-100"
                            : "bg-[#ECF39E]/40 text-[#4F772D] border border-[#ECF39E]/50"
                        }`}
                      >
                        {item.status}
                      </span>
                      {expandedId === item._id ? (
                        <ChevronUp className="text-[#4F772D] w-5 h-5" />
                      ) : (
                        <ChevronDown className="text-[#4F772D] w-5 h-5" />
                      )}
                    </div>
                  </div>

                  {expandedId === item._id && (
                    <div className="mt-4 pl-2 border-t border-[#ECF39E]/40 pt-3 text-sm animate-fadeIn">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="space-y-1.5 text-[#31572C]/80">
                          <p><strong className="text-[#31572C]">Batch ID:</strong> <span className="font-mono text-xs">{item.batchId}</span></p>
                          <p><strong className="text-[#31572C]">Species ID:</strong> {item.speciesId}</p>
                          <p><strong className="text-[#31572C]">Created At:</strong> {new Date(item.createdAt).toLocaleString("en-IN")}</p>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                          {/* Crop image (larger) in expanded view */}
                          {item.cropImage?.url && (
                            <img
                              src={item.cropImage.url}
                              alt="Crop"
                              className="w-32 h-24 rounded-xl object-cover border border-[#90A955]/20 shadow-sm"
                            />
                          )}
                          {item.batchBarCode?.url && (
                            <img
                              src={item.batchBarCode.url}
                              alt="Batch Barcode"
                              className="w-[80%] h-14 object-contain"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                </li>
              );
            })}
          </ul>

          {/* Pagination UI */}
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2 text-sm">

              <button
                onClick={() => page > 1 && changePage(page - 1)}
                disabled={page === 1}
                className="px-3 py-2 rounded-lg border border-[#90A955]/20 bg-white text-[#31572C] font-semibold disabled:bg-gray-50 disabled:text-gray-300 disabled:border-gray-100 hover:bg-[#ECF39E]/20 transition-colors cursor-pointer"
              >
                Prev
              </button>

              {getPageNumbers().map((num) => (
                <button
                  key={num}
                  onClick={() => changePage(num)}
                  className={`px-3 py-2 rounded-lg border font-semibold transition-colors cursor-pointer ${
                    num === page
                      ? "bg-[#4F772D] text-white border-[#4F772D]"
                      : "bg-white text-[#31572C] border-[#90A955]/20 hover:bg-[#ECF39E]/20"
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() => page < totalPages && changePage(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-2 rounded-lg border border-[#90A955]/20 bg-white text-[#31572C] font-semibold disabled:bg-gray-50 disabled:text-gray-300 disabled:border-gray-100 hover:bg-[#ECF39E]/20 transition-colors cursor-pointer"
              >
                Next
              </button>

            </nav>
          </div>

        </>
      )}
    </div>
  );
}
