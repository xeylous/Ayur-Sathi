"use client";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import LabDetailsModal from "./LabDetailsModal";

const UserManagement = ({ setStatusMessage }) => {
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);

  // Fetch labs from backend
  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const res = await fetch("/api/partnership");
        const json = await res.json();
        if (json.success) setLabs(json.data);
      } catch (err) {
        console.error("❌ Failed to fetch labs:", err);
      }
    };
    fetchLabs();
  }, []);

  const handleLabApproval = async (id, approve) => {
    const status = approve ? "Active" : "Rejected";
    try {
      await fetch(`/api/partnership/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      setLabs((prev) =>
        prev.map((lab) => (lab._id === id ? { ...lab, status } : lab))
      );

      setStatusMessage({
        message: `Lab ${approve ? "approved" : "rejected"} successfully`,
        isSuccess: approve,
      });
    } catch (err) {
      console.error("❌ Approval error:", err);
    }
  };

  const pendingLabs = labs.filter((lab) => lab.status === "Pending Approval");
  const activeLabs = labs.filter((lab) => lab.status === "Active");

  return (
    <>
      <h2 className="text-3xl font-extrabold text-indigo-800 mb-6">
        Laboratory Management
      </h2>

      {/* Pending */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-indigo-800 mb-4">
          Pending Laboratory Registrations
        </h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-indigo-100 text-indigo-800 text-left">
              <th className="p-3">Lab ID</th>
              <th className="p-3">Lab Name</th>
              <th className="p-3">Owner</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingLabs.map((lab) => (
              <tr key={lab._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{lab._id}</td>
                <td className="p-3">{lab.labName}</td>
                <td className="p-3">{lab.ownerName}</td>
                <td className="p-3 text-amber-600">{lab.status}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => setSelectedLab(lab)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleLabApproval(lab._id, true)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button
                    onClick={() => handleLabApproval(lab._id, false)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <XCircle size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Active */}
        <h3 className="text-xl font-semibold text-indigo-800 mt-8 mb-4">
          Active Laboratories
        </h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-indigo-100 text-indigo-800 text-left">
              <th className="p-3">Lab ID</th>
              <th className="p-3">Lab Name</th>
              <th className="p-3">Owner</th>
              <th className="p-3">Email</th>
              <th className="p-3">Accreditation</th>
            </tr>
          </thead>
          <tbody>
            {activeLabs.map((lab) => (
              <tr key={lab._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{lab._id}</td>
                <td className="p-3">{lab.labName}</td>
                <td className="p-3">{lab.ownerName}</td>
                <td className="p-3">{lab.ownerEmail}</td>
                <td className="p-3">{lab.accreditation || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedLab && (
        <LabDetailsModal
          lab={selectedLab}
          onClose={() => setSelectedLab(null)}
          onApprove={(id) => handleLabApproval(id, true)}
          onReject={(id) => handleLabApproval(id, false)}
        />
      )}
    </>
  );
};

export default UserManagement;
