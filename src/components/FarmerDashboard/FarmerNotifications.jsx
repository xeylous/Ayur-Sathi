"use client";

export default function FarmerNotifications({ notifications = [], onRemove }) {
  return (
    <div className="space-y-3 p-4">
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        notifications.map((n, i) => (
          <div
            key={i}
            className="bg-white p-3 shadow border rounded flex justify-between items-center"
          >
            <div>
              <strong>{n.type}</strong> — {n.message}
              <div className="text-xs text-gray-500">
                {n.timestamp ? new Date(n.timestamp).toLocaleString() : ""}
              </div>
            </div>
            <button
              onClick={() => onRemove && onRemove(n._id, i)}
              className="text-red-500 font-semibold ml-3"
            >
              ×
            </button>
          </div>
        ))
      )}
    </div>
  );
}
