"use client";

import { useState, useRef, useEffect } from "react";
import { X, Camera, Keyboard } from "lucide-react";
import { BrowserMultiFormatReader } from "@zxing/library";

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [isScanning, setIsScanning] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [error, setError] = useState(null);
  const [useManual, setUseManual] = useState(false);
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  useEffect(() => {
    if (isOpen && !useManual) {
      startScanning();
    }

    return () => {
      stopScanning();
    };
  }, [isOpen, useManual]);

  const startScanning = async () => {
    try {
      setError(null);
      setIsScanning(true);

      const codeReader = new BrowserMultiFormatReader();
      codeReaderRef.current = codeReader;

      const videoInputDevices = await codeReader.listVideoInputDevices();
      
      if (videoInputDevices.length === 0) {
        throw new Error("No camera found on this device");
      }

      // Use the first available camera (usually back camera on mobile)
      const selectedDeviceId = videoInputDevices[0].deviceId;

      await codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, err) => {
          if (result) {
            const scannedText = result.getText();
            handleScanSuccess(scannedText);
          }
          if (err && err.name !== "NotFoundException") {
            console.error("Scan error:", err);
          }
        }
      );
    } catch (err) {
      console.error("Camera error:", err);
      setError(err.message || "Failed to access camera");
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      codeReaderRef.current = null;
    }
    setIsScanning(false);
  };

  const handleScanSuccess = (batchId) => {
    stopScanning();
    onScanSuccess(batchId);
    onClose();
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      handleScanSuccess(manualInput.trim());
    }
  };

  const handleClose = () => {
    stopScanning();
    setManualInput("");
    setError(null);
    setUseManual(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#31572C]">
            {useManual ? "Enter Batch ID" : "Scan QR Code"}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!useManual ? (
            <>
              {/* Camera View */}
              <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  className="w-full h-64 object-cover"
                  playsInline
                />
                {!isScanning && !error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                    <Camera className="text-white" size={48} />
                  </div>
                )}
                {/* Scanning Overlay */}
                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-4 border-[#90A955] rounded-lg animate-pulse" />
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Instructions */}
              <p className="text-sm text-gray-600 text-center mb-4">
                {isScanning
                  ? "Position the QR code within the frame"
                  : "Camera is initializing..."}
              </p>

              {/* Switch to Manual Input */}
              <button
                onClick={() => setUseManual(true)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
              >
                <Keyboard size={18} />
                Enter Batch ID Manually
              </button>
            </>
          ) : (
            <>
              {/* Manual Input Form */}
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="batchId"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Batch ID
                  </label>
                  <input
                    id="batchId"
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="e.g., ASW-2025-1962"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#90A955]"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setUseManual(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <Camera size={18} className="inline mr-2" />
                    Use Camera
                  </button>
                  <button
                    type="submit"
                    disabled={!manualInput.trim()}
                    className="flex-1 py-2 px-4 bg-[#31572C] text-white rounded-lg hover:bg-[#4F772D] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
