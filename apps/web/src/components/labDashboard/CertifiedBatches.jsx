import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, QrCode, Filter, ExternalLink } from 'lucide-react';
import StatusDisplay from './StatusDisplay';

// 🧪 Mock data - replace later with API call
const mockCertifiedBatches = [
  {
    batchId: 'B4530',
    herb: 'Ashwagandha',
    farmerId: 'F00802',
    labId: 'LAB123',
    certifiedDate: '2025-09-12',
    status: 'Approved',
    blockchainHash: '0xF12A98B...',
  },
  {
    batchId: 'B4521',
    herb: 'Tulsi',
    farmerId: 'F00805',
    labId: 'LAB123',
    certifiedDate: '2025-09-15',
    status: 'Rejected',
    blockchainHash: '0xE45CD9A...',
  },
  {
    batchId: 'B4527',
    herb: 'Neem',
    farmerId: 'F00812',
    labId: 'LAB123',
    certifiedDate: '2025-09-20',
    status: 'Approved',
    blockchainHash: '0xC56D91F...',
  },
];

const CertifiedBatches = () => {
  const [certifiedBatches, setCertifiedBatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    // 🪄 Simulate fetching from backend
    setStatusMessage({ message: 'Loading certified batches...', loading: true });
    setTimeout(() => {
      setCertifiedBatches(mockCertifiedBatches);
      setStatusMessage({ message: 'Certified batches loaded successfully!', isSuccess: true });
      setTimeout(() => setStatusMessage(null), 3000);
    }, 1000);
  }, []);

  // Filter + search logic
  const filtered = certifiedBatches.filter((batch) => {
    const matchesSearch =
      batch.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.herb.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || batch.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-semibold text-emerald-800 mb-4 flex items-center gap-2">
        <QrCode size={22} /> 3. Certified Batches
      </h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 flex items-center border border-gray-300 rounded-lg px-3">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by batch ID or herb name..."
            className="w-full p-2 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="all">All</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-sm border border-gray-200">
          <thead className="bg-emerald-900 text-white text-left text-sm uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Batch ID</th>
              <th className="py-3 px-4">Herb</th>
              <th className="py-3 px-4">Farmer ID</th>
              <th className="py-3 px-4">Certified Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Blockchain Hash</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No batches found.
                </td>
              </tr>
            ) : (
              filtered.map((batch) => (
                <tr key={batch.batchId} className="border-t hover:bg-teal-50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-gray-800">{batch.batchId}</td>
                  <td className="py-3 px-4">{batch.herb}</td>
                  <td className="py-3 px-4">{batch.farmerId}</td>
                  <td className="py-3 px-4 text-gray-600">{batch.certifiedDate}</td>
                  <td className="py-3 px-4">
                    {batch.status === 'Approved' ? (
                      <span className="flex items-center text-green-700 font-semibold">
                        <CheckCircle size={16} className="mr-1" /> Approved
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600 font-semibold">
                        <XCircle size={16} className="mr-1" /> Rejected
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-sm text-blue-700 flex items-center gap-1">
                    {batch.blockchainHash}
                    <a
                      href={`https://etherscan.io/tx/${batch.blockchainHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-900"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <StatusDisplay status={statusMessage} />
    </div>
  );
};

export default CertifiedBatches;
