import React, { useState } from 'react';
import { Menu } from 'lucide-react';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Navigate to a tab with an optional pre-filled batch ID
  const navigateToTab = (tabId, batchId = '') => {
    setPrefillBatchId(batchId);
    setActiveTab(tabId);
    setIsSidebarOpen(false);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setPrefillBatchId(''); // clear prefill when switching via sidebar
    setIsSidebarOpen(false); // close sidebar on mobile after selecting
  };

  return (
    <div className="flex h-screen relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 lg:ml-64 p-4 md:p-8 overflow-y-auto w-full">
        <header className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-emerald-900 bg-white rounded-md shadow-sm border border-emerald-100"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl md:text-3xl font-extrabold text-emerald-900 border-b pb-2 md:pb-3">
              Laboratory Operations Dashboard
            </h1>
          </div>
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
