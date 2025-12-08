"use client";

import { useEffect, useState } from "react";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { speciesList } from "@/lib/cropdetails";

export default function CropHistory() {
  const pathname = usePathname();
  const uniqueId = pathname.split("/").pop();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch crop data based on page number
  const fetchCrops = async (pageNumber = 1) => {
    setLoading(true);

    try {
      const res = await fetch(`/api/crops/${uniqueId}?page=${pageNumber}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setHistory(data.data);
        setTotalPages(data.totalPages);
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

  // Initial load
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

  // Sliding window for 3-page range
  const getPageNumbers = () => {
    let start = Math.max(1, page - 1);
    let end = Math.min(totalPages, start + 2);

    // Adjust start if near the end
    if (end - start < 2) start = Math.max(1, end - 2);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6 md:mt-0">
      <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2 text-green-800">
        <Clock className="w-6 h-6" />
        Crop Upload History
      </h2>

      {loading ? (
        <p className="text-gray-600 text-center">Loading crop history...</p>
      ) : history.length === 0 ? (
        <p className="text-gray-600 text-center">No history available.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {history.map((item) => {
              const species = speciesList.find(
                (s) => s.speciesId === item.speciesId
              );
              const cropName = species ? species.name : item.speciesId;

              return (
                <li
                  key={item._id}
                  className="p-4 border rounded-lg bg-[#ECF39E]/30 hover:bg-[#90A955]/10 transition"
                >
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleExpand(item._id)}
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{cropName}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} unit •{" "}
                        {new Date(item.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.status}
                      </span>
                      {expandedId === item._id ? (
                        <ChevronUp className="text-green-700 ml-2" />
                      ) : (
                        <ChevronDown className="text-green-700 ml-2" />
                      )}
                    </div>
                  </div>

                  {expandedId === item._id && (
                    <div className="mt-4 pl-2 border-t pt-3 text-sm animate-fadeIn flex flex-col sm:flex-row justify-between items-start gap-1">
                      <div>
                        <p>
                          <strong>Batch ID:</strong> {item.batchId}
                        </p>
                        <p>
                          <strong>Species ID:</strong> {item.speciesId}
                        </p>
                        <p>
                          <strong>Created At:</strong>{" "}
                          {new Date(item.createdAt).toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div>
                        {item.batchBarCode?.url && (
                          <img
                            src={item.batchBarCode.url}
                            alt="Batch Barcode"
                            className="mx-auto w-[80%] h-16 object-contain"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Pagination UI - Sliding Window 3 Numbers */}
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2 text-sm">
              {/* Prev Button */}
              <button
                onClick={() => page > 1 && changePage(page - 1)}
                disabled={page === 1}
                className={`px-3 py-2 rounded-md border transition ${
                  page === 1
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-green-100"
                }`}
              >
                Prev
              </button>

              {/* Page Numbers (Sliding Window) */}
              {getPageNumbers().map((num) => (
                <button
                  key={num}
                  onClick={() => changePage(num)}
                  className={`px-3 py-2 rounded-md border transition ${
                    num === page
                      ? "bg-green-700 text-white border-green-700 font-semibold"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-green-100"
                  }`}
                >
                  {num}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => page < totalPages && changePage(page + 1)}
                disabled={page === totalPages}
                className={`px-3 py-2 rounded-md border transition ${
                  page === totalPages
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-green-100"
                }`}
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
