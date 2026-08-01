import React from 'react';
import { Microscope, QrCode, FlaskConical, CheckCheck, BarChart2, Wallet, X } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const tabs = [
    { id: 'batchVerification', icon: QrCode, label: 'Batch Verification' },
    { id: 'logProcessing', icon: FlaskConical, label: 'Log Processing & Cert.' },
    { id: 'testedBatch', icon: CheckCheck, label: 'Certified Batches' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics' },
    { id: 'paymentWithdraw', icon: Wallet, label: 'Payment Withdraw' },
  ];

  return (
    <aside 
      className={`w-64 bg-emerald-900 text-white p-6 shadow-xl h-full fixed top-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="text-2xl font-bold text-teal-300 flex items-center gap-2">
          <Microscope size={24} /> AyurSaathi
        </div>
        <button 
          className="lg:hidden text-gray-300 hover:text-white"
          onClick={() => setIsOpen(false)}
        >
          <X size={24} />
        </button>
      </div>
      <nav className="space-y-2">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
              activeTab === id
                ? 'bg-teal-700 font-semibold border-l-4 border-amber-300'
                : 'hover:bg-emerald-800'
            }`}
          >
            <Icon size={20} className="mr-3" />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
