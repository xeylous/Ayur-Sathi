import React, { useState, useEffect } from "react";
import { Search, CheckCircle, XCircle } from "lucide-react";
import StatusDisplay from "./StatusDisplay";
import { speciesList } from "@/lib/cropdetails"; // ✅ Import your species list

const BatchVerification = () => {
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

  // ✅ New: store all accepted batches
  const [acceptedBatches, setAcceptedBatches] = useState([]);
  const [batchLoading, setBatchLoading] = useState(false);

  const showStatus = (setter, message, isSuccess = false) => {
    setter({ message, isSuccess });
    setTimeout(() => setter(null), 4000);
  };

  // ✅ Fetch all accepted batches
  // ✅ Fetch all accepted (pending) batches
  const fetchAcceptedBatches = async () => {
    setBatchLoading(true);
    try {
      const res = await fetch(
        "/api/accepted-batch?status=Pending",
        {
          method: "GET",
          credentials: "include",
        }
      );
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

  // ✅ Fetch once on mount
  useEffect(() => {
    fetchAcceptedBatches();
  }, []);

  const handleVerify = async () => {
    const id = currentBatchId.trim().toUpperCase();
    if (!id) {
      showStatus(setVerificationStatus, "Please enter a Batch ID.", false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/labverification?batchId=${id}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      console.log("Fetched Data:", data);

      if (res.ok && data.success) {
        const details = data.data;
        setBatchDetails(details);
        setBatchId(details.batchId || "");
        const sid = details.speciesId || "";
        setSpeciesId(sid);
        setFarmerId(details.uniqueId || "");
        setHarvestDate(
          details.timestamp
            ? new Date(details.timestamp).toLocaleDateString()
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
          action: action,
          remarks: "",
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showStatus(setVerificationStatus, msg, action === "accept");
        setBatchDetails(null);
        setCurrentBatchId("");
        // 🔄 Refresh pending batches
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
        {/* 🔍 Search Section */}
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

        {/* 🧾 Batch Details */}
        {batchDetails && (
          <div className="bg-teal-50 p-4 rounded-lg border border-teal-200 mb-6">
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

        {/* ✅ Action Buttons */}
        <div className="flex gap-4">
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

        <StatusDisplay status={verificationStatus} />

        {/* 🧩 NEW SECTION: Accepted Batches */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-emerald-700 mb-3">
            Pending Batches
          </h3>

          {batchLoading ? (
            <p>Loading batches...</p>
          ) : acceptedBatches.length > 0 ? (
            <ul className="space-y-3">
              {acceptedBatches.map((batch) => (
                <li
                  key={batch.batchId}
                  className="p-3 bg-gray-50 border border-gray-200 rounded-md"
                >
                  <p>
                    <strong>Batch ID:</strong> {batch.batchId}
                  </p>
                  <p>
                    <strong>Species ID:</strong> {batch.speciesId}
                  </p>
                  <p>
                    <strong>Species Name:</strong> {batch.speciesName}
                  </p>
                  <p>
                    <strong>UploadedAt:</strong> {batch.harvestDate}
                  </p>
                  <p>
                    <strong>AcceptedAt:</strong> {batch.acceptedAt}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No pending batches found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchVerification;
