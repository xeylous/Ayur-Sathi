import React, { useState } from 'react';
import { QrCode, Upload, ClipboardList, CheckCheck } from 'lucide-react';
import StatusDisplay from './StatusDisplay';

const LogProcessing = () => {
  const [certificationStatus, setCertificationStatus] = useState(null);

  const showStatus = (setter, message, isSuccess = false, loading = false) => {
    setter({ message, isSuccess, loading });
    if (!loading) setTimeout(() => setter(null), 4000);
  };

  const handleCertify = (e) => {
    e.preventDefault();
    const id = e.target.processBatchId.value.trim().toUpperCase();
    const finalStatus = e.target.qaResult.value;
    const file = e.target.certificate.files[0];
    if (!file || finalStatus === 'pending') {
      showStatus(setCertificationStatus, 'Please upload certificate and select status.', false);
      return;
    }
    showStatus(setCertificationStatus, 'Submitting to blockchain...', true, true);
    setTimeout(() => {
      showStatus(setCertificationStatus, `Batch ${id} ${finalStatus.toUpperCase()} successfully!`, true);
    }, 2000);
  };

  return (
    <form onSubmit={handleCertify} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-semibold text-emerald-800 mb-4">2. Log Processing & Certification</h2>
      <div className="mb-4">
        <label className="block mb-1"><QrCode size={16} className="inline mr-2" /> Batch ID</label>
        <input type="text" id="processBatchId" required className="w-full p-3 border border-gray-300 rounded-lg" />
      </div>
      <div className="mb-4">
        <label className="block mb-1"><Upload size={16} className="inline mr-2" /> Upload Certificate</label>
        <input type="file" id="certificate" accept=".pdf,.doc,.docx" required className="w-full p-3 border border-gray-300 rounded-lg" />
      </div>
      <div className="mb-4">
        <label className="block mb-1"><ClipboardList size={16} className="inline mr-2" /> Notes</label>
        <textarea rows="3" className="w-full p-3 border border-gray-300 rounded-lg"></textarea>
      </div>
      <select id="qaResult" className="p-3 border border-gray-300 rounded-lg w-1/3">
        <option value="pending">Select...</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
      <button type="submit" className="ml-4 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700">
        <CheckCheck size={18} className="inline mr-2" /> Submit
      </button>
      <StatusDisplay status={certificationStatus} />
    </form>
  );
};

export default LogProcessing;
