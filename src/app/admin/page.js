"use client";
import React, { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import StatusDisplay from "@/components/admin/StatusDisplay";
import Dashboard from "@/components/admin/Dashboard";
import UserManagement from "@/components/admin/UserManagement";
import FarmerPaymentControl from "@/components/admin/FarmerPaymentControl";
import LabMarketplaceControl from "@/components/admin/LabMarketplaceControl";
import { mockBatches, mockUsers } from "@/lib/mockData";
import AdminLabApplications from "@/components/Admin/AdminLabApplications";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [batches, setBatches] = useState(mockBatches);
  const [users, setUsers] = useState(mockUsers);
  const [statusMessage, setStatusMessage] = useState(null);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-indigo-900 border-b pb-3">
            AyurSaathi Central Admin Panel
          </h1>
        </header>

        <div className="space-y-8 pb-10">
          {activeTab === "dashboard" && (
            <Dashboard
              batches={batches}
              users={users}
              setActiveTab={setActiveTab}
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
            />
          )}
        </div>

        <StatusDisplay statusMessage={statusMessage} />
      </div>
    </div>
  );
};

export default AdminPage;
