import { X } from "lucide-react";

const LabDetailsModal = ({ lab, onClose, onApprove, onReject }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-2/3 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-indigo-800">Lab Application</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">
            <X size={24} />
          </button>
        </div>

        <p><b>Lab Name:</b> {lab.labName}</p>
        <p><b>Owner:</b> {lab.ownerName}</p>
        <p><b>Email:</b> {lab.ownerEmail}</p>
        <p><b>Address:</b> {lab.address}</p>

        <div className="mt-4">
          <b>Documents:</b>
          <ul className="list-disc ml-6">
            {Object.entries(lab.documents || {}).map(([key, url]) => (
              <li key={key}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {key}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => onApprove(lab._id)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Approve
          </button>
          <button
            onClick={() => onReject(lab._id)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabDetailsModal;
