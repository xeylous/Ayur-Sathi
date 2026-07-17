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
  const [prefillBatchId, setPrefillBatchId] = useState('');

  // Navigate to a tab with an optional pre-filled batch ID
  const navigateToTab = (tabId, batchId = '') => {
    setPrefillBatchId(batchId);
    setActiveTab(tabId);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setPrefillBatchId(''); // clear prefill when switching via sidebar
  };

  return (
    <div className="flex h-screen ">
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-emerald-900 border-b pb-3">
            Laboratory Operations Dashboard
          </h1>
        </header>

        <div className="space-y-8">
          {activeTab === 'batchVerification' && <BatchVerification navigateToTab={navigateToTab} />}
          {activeTab === 'logProcessing' && <LogProcessing initialBatchId={prefillBatchId} />}
          {activeTab === 'testedBatch' && <CertifiedBatches />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'paymentWithdraw' && <PaymentWithdraw />}
        </div>
      </div>
    </div>
  );
};

export default LaboratoryPage;
