"use client";

import { use, useEffect, useState } from "react";
import {
  Loader2,
  MapPin,
  FileText,
  Leaf,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function BatchTracePage({ params }) {
  const { batchId } = use(params);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBatch = async () => {
    try {
      const res = await fetch(`/api/public/batch?batchId=${batchId}`);
      const result = await res.json();

      if (result.success && result.encoded) {
        const decoded = JSON.parse(atob(result.encoded));
        setData(decoded);
      } else {
        setData(null);
      }
    } catch (err) {
      console.error(err);
      setData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBatch();
  }, [batchId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-green-700" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold text-red-600">No Batch Data Found</h2>
        <p className="text-gray-500 mt-2">
          This batch may not exist or is not publicly accessible.
        </p>
      </div>
    );
  }

  const googleMapUrl = `https://www.google.com/maps?q=${data.gpsCoordinates.latitude},${data.gpsCoordinates.longitude}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* HEADER */}
      <div className="text-center space-y-4">
        <Leaf className="w-12 h-12 text-green-700 mx-auto" />
        <h1 className="text-3xl font-bold text-green-800">
          Ayurसाथी Traceability Report
        </h1>
        <p className="text-gray-600">Authentic | Transparent | Verified</p>
      </div>

      {/* CARD: BATCH TOP INFO */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 space-y-4">
        <h2 className="text-xl font-semibold text-green-900">
          Batch Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>Batch ID:</strong> {data.batchId}
          </p>
          <p>
            <strong>Species ID:</strong> {data.speciesId}
          </p>
          <p>
            <strong>Quantity:</strong> {data.quantity ?? "N/A"} units
          </p>
          <p>
            <strong>Approved By Lab:</strong> {data.acceptedBy}
          </p>
          <p>
            <strong>Manufactured By:</strong> {data.acceptedByManu}
          </p>
          <p>
            <strong>Manufactured Date:</strong>{" "}
            {data.manufacturedAt
              ? new Date(data.manufacturedAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>

      {/* LOCATION CARD */}
      <div className="bg-green-50 rounded-2xl shadow p-6 space-y-4 border border-green-200">
        <h2 className="text-lg font-semibold text-green-900 flex items-center gap-2">
          <MapPin className="text-green-700" /> Harvest Origin
        </h2>
        <p className="text-gray-700">
          This crop originated from verified geographic coordinates stored
          during harvest.
        </p>

        <a
          href={googleMapUrl}
          target="_blank"
          className="text-green-700 underline font-semibold hover:text-green-900"
        >
          View on Google Maps →
        </a>
      </div>

      {/* TEST RESULTS */}
      <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 space-y-4">
        <h2 className="text-xl font-semibold text-green-900">
          Lab Test Results
        </h2>

        {data.tests ? (
          <ul className="space-y-2 text-gray-700">
            {Object.entries(data.tests).map(([key, val]) => (
              <li key={key}>
                <strong className="capitalize">{key}:</strong> {val}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No test data available.</p>
        )}
      </div>

      {/* MANUFACTURING PROCESS */}
      <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 space-y-4">
        <h2 className="text-xl font-semibold text-green-900">
          Manufacturing Timeline
        </h2>

        {data.manufacturingProcesses?.length ? (
          <div className="border-l-4 border-green-600 pl-4 space-y-4">
            {data.manufacturingProcesses.map((step, index) => (
              <div key={index} className="flex flex-col">
                <span className="font-semibold text-gray-800">
                  {index + 1}. {step.processName}
                </span>
                <span className="text-sm text-gray-500">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {new Date(step.date).toLocaleDateString()}
                  {" · Operator: "}
                  {step.operator}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No manufacturing data found.</p>
        )}
      </div>

      {/* CERTIFICATE + APPROVED STAMP */}
      <div className="relative bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        {/* 🔥 Circular Approved Stamp */}
        <div
          className="absolute top-6 right-6 w-32 h-32 flex items-center justify-center 
    rounded-full border-[6px] border-green-700 bg-white text-green-700 font-bold 
    rotate-[-15deg] shadow-lg"
        >
          <div
            className="w-24 h-24 rounded-full border-2 border-dashed border-green-700 
      flex items-center justify-center text-center leading-tight"
          >
            <span className="uppercase tracking-wide">Approved</span>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-green-900 mb-3 flex items-center gap-2">
          <FileText className="text-green-700" /> Quality Certificate
        </h2>

        <div className="bg-gray-50 rounded-xl border border-gray-300 shadow-inner p-4">
          {data.certificateUrl.endsWith(".pdf") ? (
            <iframe
              src={data.certificateUrl}
              className="w-full h-[400px] rounded-lg"
            ></iframe>
          ) : (
            <img
              src={data.certificateUrl}
              className="w-full rounded-lg shadow"
            />
          )}
        </div>
      </div>

      {/* FOOTER */}
      <p className="text-center text-sm text-gray-400 mt-10">
        © {new Date().getFullYear()} Ayurसाथी | Verified Natural Supply Chain
      </p>
    </div>
  );
}
