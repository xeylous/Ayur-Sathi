import React, { useState } from 'react';
import { QrCode, Search, CheckCircle, XCircle } from 'lucide-react';
import StatusDisplay from './StatusDisplay';

const mockBatchDetails = {
  B4530: { farmerId: 'F00802', location: 'Karnataka Forest', herb: 'Ashwagandha', status: 'Pending Lab Acceptance' },
  B4521: { farmerId: 'F00805', location: 'UP Farm', herb: 'Tulsi', status: 'Accepted by Lab' },
};

const BatchVerification = () => {
  const [currentBatchId, setCurrentBatchId] = useState('');
  const [batchDetails, setBatchDetails] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);

  const showStatus = (setter, message, isSuccess = false) => {
    setter({ message, isSuccess });
    setTimeout(() => setter(null), 5000);
  };

  const handleVerify = () => {
    const id = currentBatchId.trim().toUpperCase();
    if (id && mockBatchDetails[id]) {
      setBatchDetails(mockBatchDetails[id]);
      showStatus(setVerificationStatus, 'Batch details fetched from blockchain.', true);
    } else {
      setBatchDetails(null);
      showStatus(setVerificationStatus, 'Error: Invalid Batch ID.', false);
    }
  };

  const handleAcceptDecline = (action) => {
    if (!batchDetails) {
      showStatus(setVerificationStatus, 'Please verify a batch first.', false);
      return;
    }
    const msg =
      action === 'accept'
        ? `Batch ${currentBatchId} ACCEPTED for testing.`
        : `Batch ${currentBatchId} DECLINED. Farmer notified.`;
    showStatus(setVerificationStatus, msg, action === 'accept');
    setBatchDetails(null);
    setCurrentBatchId('');
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-emerald-800 mb-4">1. Batch Verification</h2>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={currentBatchId}
            onChange={(e) => setCurrentBatchId(e.target.value)}
            placeholder="Enter Batch ID..."
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
          />
          <button onClick={handleVerify} className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700">
            <Search size={18} className="inline mr-2" /> Fetch
          </button>
        </div>

        {batchDetails && (
          <div className="bg-teal-50 p-4 rounded-lg border border-teal-200 mb-6">
            <p className="font-bold text-teal-800">Status: Verified</p>
            <p>Farmer ID: {batchDetails.farmerId}</p>
            <p>Herb: {batchDetails.herb}</p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => handleAcceptDecline('accept')}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex justify-center items-center"
          >
            <CheckCircle size={18} className="mr-2" /> Accept
          </button>
          <button
            onClick={() => handleAcceptDecline('decline')}
            className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 flex justify-center items-center"
          >
            <XCircle size={18} className="mr-2" /> Decline
          </button>
        </div>
        <StatusDisplay status={verificationStatus} />
      </div>
    </div>
  );
};

export default BatchVerification;
