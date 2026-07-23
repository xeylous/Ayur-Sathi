"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Leaf, FlaskConical, Truck, CheckCircle2, ExternalLink } from "lucide-react";

export default function UserOrder() {
  const [orders, setOrders] = useState([]);

  // Load orders from localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem("userOrders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Helper to calculate days passed since order
  const getDaysDiff = (dateStr) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) {
        const parts = dateStr.split(" ");
        if (parts.length === 3) {
          const months = {
            january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
            july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
          };
          const day = parseInt(parts[0]);
          const month = months[parts[1].toLowerCase()];
          const year = parseInt(parts[2]);
          const parsedDate = new Date(year, month, day);
          if (!isNaN(parsedDate.getTime())) {
            return Math.floor((new Date() - parsedDate) / (1000 * 60 * 60 * 24));
          }
        }
        return 1;
      }
      return Math.floor((new Date() - d) / (1000 * 60 * 60 * 24));
    } catch (e) {
      return 1;
    }
  };

  // Helper to calculate expected delivery date (+4 days)
  const getExpectedDeliveryDate = (dateStr) => {
    try {
      let d = new Date(dateStr);
      if (isNaN(d.getTime())) {
        const parts = dateStr.split(" ");
        if (parts.length === 3) {
          const months = {
            january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
            july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
          };
          const day = parseInt(parts[0]);
          const month = months[parts[1].toLowerCase()];
          const year = parseInt(parts[2]);
          d = new Date(year, month, day);
        }
      }
      if (!isNaN(d.getTime())) {
        d.setDate(d.getDate() + 4);
        return d.toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
      }
      return "Calculated soon";
    } catch (e) {
      return "Calculated soon";
    }
  };

  const steps = [
    { label: "Ordered", icon: <Package className="w-5 h-5" /> },
    { label: "Sourced", icon: <Leaf className="w-5 h-5" /> },
    { label: "QA Tested", icon: <FlaskConical className="w-5 h-5" /> },
    { label: "In Transit", icon: <Truck className="w-5 h-5" /> },
    { label: "Delivered", icon: <CheckCircle2 className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen w-full flex items-start justify-center py-6 px-2 sm:px-4 bg-transparent">
      <div className="w-full max-w-4xl bg-white/95 border border-[#90A955]/20 shadow-xl rounded-2xl p-6 sm:p-10">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-[#31572C]">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            📦 No orders yet. Your orders will appear here once you place them.
          </p>
        ) : (
          <div className="space-y-8">
            {orders.map((order, orderIdx) => {
              const batchId = order.batchId || "MUL-2026-4871";
              const price = order.price || (order.quantity * 299);
              const daysDiff = getDaysDiff(order.date);

              // Stepper config based on elapsed days
              let activeStep = 0;
              let currentStatus = "Order Received & Placed";
              let currentLocation = "Ayurसाथी Logistics Hub, Bangalore";

              if (daysDiff === 0) {
                activeStep = 1;
                currentStatus = "Sourced from Smallholder Cooperative";
                currentLocation = "Smallholder Cooperatives Hub, Wayanad";
              } else if (daysDiff === 1) {
                activeStep = 2;
                currentStatus = "Quality Tested & Certified";
                currentLocation = "AyurTrace QMS Testing Lab, Hubli";
              } else if (daysDiff === 2) {
                activeStep = 3;
                currentStatus = "Dispatched & In Transit";
                currentLocation = "Regional Cargo Hub, Mumbai";
              } else if (daysDiff >= 3) {
                activeStep = 4;
                currentStatus = "Delivered & Verified";
                currentLocation = "Customer Gateway Address";
              }

              return (
                <div
                  key={orderIdx}
                  className="border border-[#90A955]/20 p-5 sm:p-7 rounded-2xl shadow-md bg-white hover:shadow-lg transition-all duration-300"
                >
                  {/* Order Details Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-4">
                    <div>
                      <Link
                        href={`/marketplace/${batchId}`}
                        className="hover:underline font-bold text-xl sm:text-2xl text-[#31572C] flex items-center gap-1.5 cursor-pointer"
                      >
                        {order.cropName}
                      </Link>
                      <p className="text-gray-500 text-xs mt-1">Batch: <span className="font-mono text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">{batchId}</span></p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm text-gray-500">Ordered on: <span className="font-semibold text-gray-700">{order.date}</span></p>
                      <p className="text-lg font-bold text-[#31572C] mt-0.5">Total: ₹{price}</p>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="my-4 flex items-center gap-2">
                    <span className="text-sm text-gray-600 bg-[#ECF39E]/30 px-3 py-1 rounded-full font-medium">
                      Quantity: {order.quantity} units
                    </span>
                  </div>

                  {/* Shipment Details Box */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 my-5 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Status Description</p>
                      <p className="font-bold text-[#31572C] mt-1">{currentStatus}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Current Location</p>
                      <p className="font-semibold text-gray-700 mt-1">{currentLocation}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Expected Delivery</p>
                      <p className="font-semibold text-gray-700 mt-1">
                        {activeStep === 4 ? "Completed" : getExpectedDeliveryDate(order.date)}
                      </p>
                    </div>
                  </div>

                  {/* supply chain progress Stepper */}
                  <div className="my-6">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4">Supply Chain & Delivery Progress</p>
                    
                    {/* Stepper container */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative gap-6 md:gap-2">
                      {steps.map((step, idx) => {
                        const isCompleted = activeStep >= idx;
                        const isCurrent = activeStep === idx;
                        return (
                          <div key={idx} className="flex md:flex-col items-center flex-1 w-full relative">
                            {/* Connector line (desktop) */}
                            {idx < steps.length - 1 && (
                              <div className={`hidden md:block absolute top-5 left-1/2 w-full h-[3px] -z-0 ${
                                activeStep > idx ? "bg-[#4F772D]" : "bg-gray-200"
                              }`} />
                            )}
                            {/* Connector line (mobile) */}
                            {idx < steps.length - 1 && (
                              <div className={`md:hidden absolute left-5 top-10 h-full w-[3px] -z-0 ${
                                activeStep > idx ? "bg-[#4F772D]" : "bg-gray-200"
                              }`} />
                            )}

                            {/* Node icon */}
                            <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                              isCompleted 
                                ? "bg-[#31572C] border-[#31572C] text-white shadow" 
                                : "bg-white border-gray-300 text-gray-400"
                            } ${isCurrent ? "ring-4 ring-[#ECF39E]" : ""}`}>
                              {step.icon}
                            </div>

                            {/* Node text */}
                            <div className="ml-4 md:ml-0 md:mt-2 text-left md:text-center">
                              <p className={`text-sm font-bold ${isCompleted ? "text-[#31572C]" : "text-gray-400"}`}>
                                {step.label}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Blockchain Provenance Trace Button */}
                  <div className="mt-6 flex justify-end">
                    <Link
                      href={`/batchid/${batchId}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#31572C] hover:bg-[#4F772D] text-white text-sm font-extrabold rounded-xl transition shadow-md hover:shadow-lg cursor-pointer"
                    >
                      Audit Supply Chain Ledger
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
