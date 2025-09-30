// app/admin/page.jsx
"use client";

import { useEffect, useState } from "react";

export default function AdminLabApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    fetchList();
  }, []);

  async function fetchList() {
    setLoading(true);
    try {
      const res = await fetch("/api/partnership");
      const json = await res.json();
      if (res.ok && json.success) {
        setApps(json.data);
      } else {
        console.error("Failed to fetch apps", json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openInNewTab(url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function viewApp(app) {
    setSelected(app);
    setReason(app.adminNote || "");
  }

  async function handleAction(action) {
    if (!selected) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/partnership", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected._id, action, adminNote: reason }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        // update locally
        setApps((prev) => prev.map((a) => (a._id === json.data._id ? json.data : a)));
        setSelected(json.data);
      } else {
        alert("Action failed: " + (json.error || "unknown"));
      }
    } catch (err) {
      console.error(err);
      alert("Action failed. See console.");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Lab Applications (Admin)</h1>

        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Lab</th>
                <th className="px-4 py-3 text-left">Owner</th>
                <th className="px-4 py-3 text-left">Submitted</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-6 text-center">Loading...</td></tr>
              ) : apps.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center">No applications found.</td></tr>
              ) : (
                apps.map((app) => (
                  <tr key={app._id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="font-semibold">{app.labName}</div>
                      <div className="text-sm text-gray-500">{app.address}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{app.ownerName}</div>
                      <div className="text-sm text-gray-500">{app.ownerEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(app.submittedAt).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={
                        "px-3 py-1 rounded-full text-sm font-medium " +
                        (app.status === "Approved" ? "bg-green-100 text-green-800" :
                         app.status === "Rejected" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800")
                      }>{app.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => viewApp(app)} className="px-3 py-1 rounded-md border text-sm">View</button>
                        <button onClick={() => handleAction("approve")} className="px-3 py-1 rounded-md border text-sm bg-green-50 hover:bg-green-100">Approve</button>
                        <button onClick={() => { viewApp(app); handleAction("reject"); }} className="px-3 py-1 rounded-md border text-sm bg-red-50 hover:bg-red-100">Reject</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Viewer / Details */}
        {selected && (
          <div className="mt-6 bg-white shadow rounded-lg p-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">{selected.labName}</h2>
                <div className="text-sm text-gray-600">{selected.ownerName} • {selected.ownerEmail}</div>
                <div className="text-sm text-gray-600 mt-1">PAN: {selected.panCard}</div>
                <div className="text-sm text-gray-500 mt-2">{selected.address}</div>
              </div>
              <div className="text-sm text-gray-500">Submitted: {new Date(selected.submittedAt).toLocaleString()}</div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(selected.documents || {}).map(([k, url]) => (
                <div key={k} className="border rounded p-3">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{k.replace(/([A-Z])/g, " $1")}</div>
                    <div className="flex gap-2">
                      <button onClick={() => openInNewTab(url)} className="text-sm underline">Open</button>
                      <button onClick={() => {
                        // open a simple viewer in a new tab that displays as PDF
                        openInNewTab(url);
                      }} className="text-sm">View</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Admin note / reason (optional)</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full rounded border px-3 py-2"
                placeholder="Add comments or rejection reason..."
              />
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleAction("approve")}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                disabled={actionLoading}
              >
                {actionLoading ? "Working..." : "Approve"}
              </button>
              <button
                onClick={() => handleAction("reject")}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                disabled={actionLoading}
              >
                {actionLoading ? "Working..." : "Reject"}
              </button>
              <button
                onClick={() => { setSelected(null); setReason(""); }}
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
