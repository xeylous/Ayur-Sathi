"use client";

import { useEffect, useState } from "react";

export default function AdminManufactureApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [reason, setReason] = useState("");

  // Fetch manufacturer applications
  useEffect(() => {
    fetchList();
  }, []);

  async function fetchList() {
    setLoading(true);
    try {
      const res = await fetch("/api/manufacturePartnership");
      const json = await res.json();
      if (res.ok && json.success) {
        setApps(json.data);
      } else {
        console.error("Failed to fetch applications", json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Generate signed URL to view PDF
  async function openInPopup(publicId) {
    try {
      const res = await fetch(`/api/signed-url?id=${encodeURIComponent(publicId)}`);
      const json = await res.json();

      if (res.ok && json.success) {
        window.open(json.url, "_blank", "width=1200,height=800");
      } else {
        alert("Failed to generate signed link: " + (json.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error opening signed URL:", err);
      alert("Could not open document.");
    }
  }

  function viewApp(app) {
    setSelected(app);
    setReason(app.adminNote || "");
  }

  // ✅ Approve manufacturer
  async function handleApprove(app) {
    const confirmApprove = confirm(
      `Are you sure you want to APPROVE "${app.manufacturerName}" owned by ${app.ownerName}?`
    );
    if (!confirmApprove) return;

    setActionLoading(true);
    try {
      const res = await fetch("/api/manufactureApprove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ manufacturerId: app._id }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        alert(`${app.manufacturerName} approved successfully.`);
        setApps((prev) =>
          prev.map((a) => (a._id === app._id ? { ...a, status: "Approved" } : a))
        );
        setSelected((prev) =>
          prev && prev._id === app._id ? { ...prev, status: "Approved" } : prev
        );
      } else {
        alert("Approval failed: " + (json.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error approving:", err);
      alert("Approval failed. See console for details.");
    } finally {
      setActionLoading(false);
    }
  }

  // ✅ Reject manufacturer
  async function handleReject(app) {
    const confirmReject = confirm(
      `Are you sure you want to REJECT "${app.manufacturerName}"?\nYou can add a reason below.`
    );
    if (!confirmReject) return;

    setActionLoading(true);
    try {
      const res = await fetch("/api/manufacturePartnership", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: app._id, action: "reject", adminNote: reason }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        alert(`❌ ${app.manufacturerName} rejected.`);
        setApps((prev) =>
          prev.map((a) => (a._id === json.data._id ? json.data : a))
        );
        setSelected(json.data);
      } else {
        alert("Rejection failed: " + (json.error || "unknown"));
      }
    } catch (err) {
      console.error(err);
      alert("Rejection failed. See console.");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Manufacturer Applications (Admin)</h1>
        {/* Applications Table */}
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Manufacturer</th>
                <th className="px-4 py-3 text-left">Owner</th>
                <th className="px-4 py-3 text-left">Submitted</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : apps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center">
                    No applications found.
                  </td>
                </tr>
              ) : (
                apps.map((app) => (
                  <tr key={app._id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="font-semibold">{app.manufacturerName}</div>
                      <div className="text-sm text-gray-500">{app.factoryAddress}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{app.ownerName}</div>
                      <div className="text-sm text-gray-500">{app.ownerEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(app.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          "px-3 py-1 rounded-full text-sm font-medium " +
                          (app.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : app.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800")
                        }
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => viewApp(app)}
                          className="px-3 py-1 rounded-md border text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleApprove(app)}
                          className="px-3 py-1 rounded-md border text-sm bg-green-50 hover:bg-green-100"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(app)}
                          className="px-3 py-1 rounded-md border text-sm bg-red-50 hover:bg-red-100"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Selected Application Viewer */}
        {selected && (
          <div className="mt-6 bg-white shadow rounded-lg p-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">{selected.manufacturerName}</h2>
                <div className="text-sm text-gray-600">
                  {selected.ownerName} • {selected.ownerEmail}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  GST: {selected.gstNumber}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {selected.factoryAddress}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Submitted: {new Date(selected.createdAt).toLocaleString()}
              </div>
            </div>

            {/* Document Viewer */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(selected.documents || {}).map(([key, id]) => (
                <div key={key} className="border rounded p-3">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">
                      {key.replace(/([A-Z])/g, " $1")}
                    </div>
                    <button
                      onClick={() => openInPopup(id)}
                      className="text-sm underline"
                    >
                      Open
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Admin Note */}
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">
                Admin note / reason (optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full rounded border px-3 py-2"
                placeholder="Add comments or rejection reason..."
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleApprove(selected)}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                disabled={actionLoading}
              >
                {actionLoading ? "Working..." : "Approve"}
              </button>
              <button
                onClick={() => handleReject(selected)}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                disabled={actionLoading}
              >
                {actionLoading ? "Working..." : "Reject"}
              </button>
              <button
                onClick={() => {
                  setSelected(null);
                  setReason("");
                }}
                className="px-4 py-2 rounded border"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
