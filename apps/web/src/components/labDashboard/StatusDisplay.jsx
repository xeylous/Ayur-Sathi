import React from 'react';
import { Clock } from 'lucide-react';

const StatusDisplay = ({ status }) => {
  if (!status) return null;
  return (
    <div
      className={`p-4 mt-4 rounded-lg font-semibold text-center ${
        status.loading
          ? 'bg-blue-100 text-blue-800'
          : status.isSuccess
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}
    >
      {status.loading && <Clock size={16} className="inline mr-2 animate-spin" />}
      {status.message}
    </div>
  );
};

export default StatusDisplay;
