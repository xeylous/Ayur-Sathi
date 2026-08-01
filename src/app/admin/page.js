"use client";
import React, { useState } from "react";
import Sidebar from "@/components/Admin/Sidebar";
import StatusDisplay from "@/components/Admin/StatusDisplay";
import Dashboard from "@/components/Admin/Dashboard";
import UserManagement from "@/components/Admin/UserManagement";
import FarmerPaymentControl from "@/components/Admin/FarmerPaymentControl";
import LabMarketplaceControl from "@/components/Admin/LabMarketplaceControl";
import { mockBatches, mockUsers } from "@/lib/mockData";
import AdminLabApplications from "@/components/Admin/AdminLabApplications";
import AdminManufactureApplications from "@/components/Admin/AdminManufactureApplications";
import { useAuth } from "@/context/AuthContext";
import ManufacturingLogs from "@/components/Admin/ManufacturingLogs";
import { Menu } from "lucide-react";

const AdminPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(
    user?.role === "store_admin" || user?.type === "store_admin"
      ? "laboratory"
      : "dashboard"
  );
  const [batches, setBatches] = useState(mockBatches);
  const [users, setUsers] = useState(mockUsers);
  const [statusMessage, setStatusMessage] = useState(null);
  const [selectedListingBatch, setSelectedListingBatch] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isStoreAdmin = user?.role === "store_admin" || user?.type === "store_admin";

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-grow lg:ml-64 p-4 md:p-8 overflow-y-auto w-full">
        <header className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-indigo-900 bg-white rounded-md shadow-sm border border-indigo-100"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl md:text-3xl font-extrabold text-indigo-900 border-b pb-2 md:pb-3">
              {isStoreAdmin ? "AyurSaathi Store Admin Panel" : "AyurSaathi Central Admin Panel"}
            </h1>
          </div>
        </header>

        <div className="space-y-8 pb-10">
          {activeTab === "dashboard" && (
            <Dashboard
              batches={batches}
              users={users}
              setActiveTab={handleTabChange}
            />
          )}
          {activeTab === "user" && (
            <AdminLabApplications
            />
          )}
          {activeTab === "farmerPayment" && (
            <FarmerPaymentControl
              batches={batches}
              setBatches={setBatches}
              setStatusMessage={setStatusMessage}
            />
          )}
          {activeTab === "laboratory" && (
            <LabMarketplaceControl
              batches={batches}
              setBatches={setBatches}
              setStatusMessage={setStatusMessage}
              selectedListingBatch={selectedListingBatch}
              setSelectedListingBatch={setSelectedListingBatch}
            />
          )}
          {activeTab === "manufacturer" && (
            <AdminManufactureApplications/>
          )}
          {activeTab === "manufacturingLogs" && (
            <ManufacturingLogs 
              onAddToListing={(batch) => {
                setSelectedListingBatch(batch);
                setActiveTab("laboratory");
              }}
            />
          )}
        </div>

        <StatusDisplay statusMessage={statusMessage} />
      </div>
    </div>
  );
};

export default AdminPage;
