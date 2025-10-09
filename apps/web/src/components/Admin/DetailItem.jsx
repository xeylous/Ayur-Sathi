"use client";

const DetailItem = ({ label, value }) => (
  <div className="mb-3">
    <p className="text-xs text-gray-500 uppercase">{label}</p>
    <p className="text-sm font-semibold text-gray-800">{value}</p>
  </div>
);

export default DetailItem;
