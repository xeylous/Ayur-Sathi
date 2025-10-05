import React, { useState } from 'react';
import Sidebar from './Sidebar';
import BatchVerification from './BatchVerification';
import LogProcessing from './LogProcessing';
import CertifiedBatches from './CertifiedBatches';
import Analytics from './Analytics';
import PaymentWithdraw from './PaymentWithdraw';
import StatusDisplay from './StatusDisplay';

// Main Laboratory Dashboard component
const LaboratoryPage = () => {
  const [activeTab, setActiveTab] = useState('batchVerification');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-emerald-900 border-b pb-3">
            Laboratory Operations Dashboard
          </h1>
        </header>

        <div className="space-y-8">
          {activeTab === 'batchVerification' && <BatchVerification />}
          {activeTab === 'logProcessing' && <LogProcessing />}
          {activeTab === 'testedBatch' && <CertifiedBatches />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'paymentWithdraw' && <PaymentWithdraw />}
        </div>
      </div>
    </div>
  );
};

export default LaboratoryPage;
