import React, { useState, useEffect } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  Play,
  Leaf,
  Clock,
  Package,
  User,
  MapPin,
  RefreshCw,
  Loader2,
  ImageIcon,
} from "lucide-react";
import StatusDisplay from "./StatusDisplay";
import { speciesList } from "@/lib/cropdetails";

const BatchVerification = ({ navigateToTab }) => {
  const [currentBatchId, setCurrentBatchId] = useState("");
  const [batchDetails, setBatchDetails] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const [speciesId, setSpeciesId] = useState("");
  const [farmerId, setFarmerId] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [speciesName, setSpeciesName] = useState("");
  const [batchId, setBatchId] = useState("");

  // Store all accepted batches (already accepted by lab, in progress)
  const [acceptedBatches, setAcceptedBatches] = useState([]);
  const [batchLoading, setBatchLoading] = useState(false);

  // NEW: Store farmer-uploaded pending crops
  const [farmerUploads, setFarmerUploads] = useState([]);
  const [farmerUploadsLoading, setFarmerUploadsLoading] = useState(false);

  const showStatus = (setter, message, isSuccess = false) => {
    setter({ message, isSuccess });
    setTimeout(() => setter(null), 4000);
  };

  // ─── Fetch farmer-uploaded pending crops (NEW) ───
  const fetchFarmerUploads = async () => {
    setFarmerUploadsLoading(true);
    try {
      const res = await fetch(`/api/labverification/pending?t=${Date.now()}`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const formattedUploads = data.data.map((crop) => {
          const species = speciesList.find(
            (item) => item.speciesId === crop.speciesId
          );
          return {
            ...crop,
            speciesName: species ? species.name : "Unknown Species",
          };
        });
        setFarmerUploads(formattedUploads);
      } else {
        console.error("Error fetching farmer uploads:", data.message);
      }
    } catch (err) {
      console.error("Error fetching farmer uploads:", err);
    } finally {
      setFarmerUploadsLoading(false);
    }
  };

  // ─── Fetch all accepted (in-progress) batches ───
  const fetchAcceptedBatches = async () => {
    setBatchLoading(true);
    try {
      const res = await fetch(`/api/accepted-batch?status=Pending&t=${Date.now()}`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const formattedBatches = data.data.map((batch) => {
          const species = speciesList.find(
            (item) => item.speciesId === batch.speciesId
          );
          return {
            ...batch,
            speciesName: species ? species.name : "Unknown Species",
          };
        });

        setAcceptedBatches(formattedBatches);
      } else {
        console.error("Error fetching accepted batches:", data.message);
      }
    } catch (err) {
      console.error("Error fetching accepted batches:", err);
    } finally {
      setBatchLoading(false);
    }
  };

  // Fetch both lists on mount
  useEffect(() => {
    fetchFarmerUploads();
    fetchAcceptedBatches();
  }, []);

  // Click on a farmer upload card → auto-fill batch ID and verify
  const handleCardClick = (uploadBatchId) => {
    setCurrentBatchId(uploadBatchId);
    // Trigger verify with the batch ID directly
    verifyBatchById(uploadBatchId);
  };

  // Verify by a specific batch ID (used by card click)
  const verifyBatchById = async (id) => {
    const trimmedId = id.trim().toUpperCase();
    if (!trimmedId) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/labverification?batchId=${trimmedId}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const details = data.data;
        setBatchDetails(details);
        setBatchId(details.batchId || "");
        setCurrentBatchId(details.batchId || "");
        const sid = details.speciesId || "";
        setSpeciesId(sid);
        setFarmerId(details.uniqueId || "");
        setHarvestDate(
          details.timestamp
            ? new Date(details.timestamp).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : ""
        );
        setQuantity(details.quantity || "");

        const species = speciesList.find((item) => item.speciesId === sid);
        setSpeciesName(species ? species.name : "Unknown Species");

        showStatus(
          setVerificationStatus,
          "Batch details fetched successfully.",
          true
        );
      } else {
        setBatchDetails(null);
        showStatus(
          setVerificationStatus,
          data.message || "Error fetching batch details.",
          false
        );
      }
    } catch (err) {
      console.error("Error fetching batch:", err);
      setBatchDetails(null);
      showStatus(setVerificationStatus, "Network or server error.", false);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const id = currentBatchId.trim().toUpperCase();
    if (!id) {
      showStatus(setVerificationStatus, "Please enter a Batch ID.", false);
      return;
    }
    verifyBatchById(id);
  };

  const handleAcceptDecline = async (action) => {
    if (!batchDetails) {
      showStatus(setVerificationStatus, "Please verify a batch first.", false);
      return;
    }

    const msg =
      action === "accept"
        ? `Batch ${currentBatchId} ACCEPTED for testing.`
        : `Batch ${currentBatchId} DECLINED. Farmer notified.`;

    try {
      const res = await fetch("/api/labverification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          batchId: currentBatchId,
          action: action === "accept" ? "accept" : "reject",
          remarks: "",
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch (parseErr) {
        console.error("Failed to parse response:", parseErr);
        showStatus(setVerificationStatus, "Server error. Please try again.", false);
        return;
      }

      if (res.ok && data.success) {
        showStatus(setVerificationStatus, msg, action === "accept");
        setBatchDetails(null);
        setCurrentBatchId("");
        // Refresh both lists
        fetchFarmerUploads();
        fetchAcceptedBatches();
      } else {
        showStatus(
          setVerificationStatus,
          data.message || "Error updating batch status.",
          false
        );
      }
    } catch (error) {
      console.error("Error:", error);
      showStatus(setVerificationStatus, "Network or server error.", false);
    }
  };

  return (
    <div className="border border-gray-100 bg-white rounded-lg">
      <h2 className="text-2xl font-semibold text-emerald-800 ml-6 mt-6">
        1. Batch Verification
      </h2>

      <div className="p-6">
        {/* ──────────────────────────────────────────────── */}
        {/* 🔍 SEARCH BAR + FETCH BUTTON (TOP)              */}
        {/* ──────────────────────────────────────────────── */}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={currentBatchId}
            onChange={(e) => setCurrentBatchId(e.target.value)}
            placeholder="Enter Batch ID..."
            className="flex-grow p-3 border border-gray-300 rounded-lg"
          />
          <button
            onClick={handleVerify}
            className={`bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 ${
              loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            disabled={loading}
          >
            <Search size={18} className="inline mr-2" />
            {loading ? "Fetching..." : "Fetch"}
          </button>
        </div>

        {/* 🧾 Batch Details (shown after fetch) */}
        {batchDetails && (
          <div className="bg-teal-50 p-4 rounded-lg border border-teal-200 mb-4">
            <p className="font-bold text-teal-800 mb-2">
              Status: {batchDetails.status}
            </p>
            <p>Batch ID: {batchId}</p>
            <p>Species ID: {speciesId}</p>
            <p>Species Name: {speciesName}</p>
            <p>Farmer ID: {farmerId}</p>
            <p>Harvest Date: {harvestDate}</p>
            <p>Quantity: {quantity}kg</p>
          </div>
        )}

        {/* ✅ Action Buttons — only show after fetching */}
        {batchDetails && (
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => handleAcceptDecline("accept")}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex justify-center items-center cursor-pointer"
            >
              <CheckCircle size={18} className="mr-2" /> Accept
            </button>
            <button
              onClick={() => handleAcceptDecline("decline")}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 flex justify-center items-center cursor-pointer"
            >
              <XCircle size={18} className="mr-2" /> Decline
            </button>
          </div>
        )}

        <StatusDisplay status={verificationStatus} />

        {/* ──────────────────────────────────────────────── */}
        {/* 🌿 NEW FARMER UPLOADS SECTION                   */}
        {/* ──────────────────────────────────────────────── */}
        <div className="mb-8 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                New Farmer Uploads
              </h3>
              {farmerUploads.length > 0 && (
                <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                  {farmerUploads.length}
                </span>
              )}
            </div>
            <button
              onClick={fetchFarmerUploads}
              disabled={farmerUploadsLoading}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  farmerUploadsLoading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>
          </div>

          {farmerUploadsLoading ? (
            <div className="flex items-center justify-center py-10 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Loading farmer uploads...
            </div>
          ) : farmerUploads.length > 0 ? (
            <div className="space-y-4">
              {farmerUploads.map((crop) => (
                <div
                  key={crop.batchId}
                  className="group bg-gradient-to-r from-white to-amber-50/40 border border-amber-100 rounded-xl overflow-hidden
                             hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100/50 
                             transition-all duration-300"
                >
                  {/* Top row: Data (left) + Image (right) */}
                  <div className="flex flex-col sm:flex-row">
                    {/* LEFT — Crop Data */}
                    <div className="flex-1 p-5">
                      {/* Pending badge + Batch ID */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200">
                          <Clock className="w-2.5 h-2.5" />
                          Pending
                        </span>
                        <span className="text-sm font-bold text-gray-800 font-mono tracking-wide">
                          {crop.batchId}
                        </span>
                      </div>

                      {/* Detail rows */}
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span className="text-gray-400 min-w-[90px]">Crop Name</span>
                          <span className="font-semibold text-gray-800">
                            {crop.speciesName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <span className="text-gray-400 min-w-[90px]">Quantity</span>
                          <span className="font-semibold text-gray-800">
                            {crop.quantity} kg
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-purple-500 flex-shrink-0" />
                          <span className="text-gray-400 min-w-[90px]">Farmer ID</span>
                          <span className="font-semibold text-gray-800 truncate max-w-[180px]">
                            {crop.uniqueId}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-400 min-w-[90px]">Upload Date</span>
                          <span className="font-semibold text-gray-800">
                            {crop.timestamp || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
                          <span className="text-gray-400 min-w-[90px]">Location</span>
                          <span className="font-semibold text-gray-800">
                            {crop.gpsCoordinates
                              ? `${crop.gpsCoordinates.latitude?.toFixed(4)}°, ${crop.gpsCoordinates.longitude?.toFixed(4)}°`
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT — Crop Image */}
                    <div className="w-full sm:w-48 h-48 sm:h-auto sm:min-h-[180px] flex-shrink-0 sm:border-l border-t sm:border-t-0 border-amber-100">
                      {crop.cropImage ? (
                        <img
                          src={crop.cropImage}
                          alt="Crop"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center gap-1">
                          <ImageIcon className="w-10 h-10 text-gray-300" />
                          <span className="text-[10px] text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom — Verify Button */}
                  <div className="px-5 py-3 bg-amber-50/60 border-t border-amber-100 flex justify-end">
                    <button
                      onClick={() => handleCardClick(crop.batchId)}
                      className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 
                                 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md
                                 transition-all duration-200 cursor-pointer"
                    >
                      <Search className="w-4 h-4" />
                      Verify Batch
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
              <Leaf className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                No new crop uploads from farmers
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Farmer uploads will appear here automatically
              </p>
            </div>
          )}
        </div>

        {/* ──────────────────────────────────────────────── */}
        {/* 🧩 ACCEPTED BATCHES (IN PROGRESS) SECTION       */}
        {/* ──────────────────────────────────────────────── */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Play className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-emerald-700">
              Pending Batches
            </h3>
            {acceptedBatches.length > 0 && (
              <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                {acceptedBatches.length}
              </span>
            )}
          </div>

          {batchLoading ? (
            <div className="flex items-center justify-center py-8 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Loading batches...
            </div>
          ) : acceptedBatches.length > 0 ? (
            <ul className="space-y-3">
              {acceptedBatches.map((batch) => (
                <li
                  key={batch.batchId}
                  className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl hover:border-emerald-200 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray-800 font-mono">
                        {batch.batchId}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Species:</span>{" "}
                        {batch.speciesName}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Uploaded:</span>{" "}
                        {batch.harvestDate}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Accepted:</span>{" "}
                        {batch.acceptedAt}
                      </p>
                    </div>

                    {/* Action Button */}
                    {navigateToTab && (
                      <button
                        onClick={() =>
                          navigateToTab("logProcessing", batch.batchId)
                        }
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        Process Log
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
              <p className="text-sm text-gray-500">
                No pending batches found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchVerification;
