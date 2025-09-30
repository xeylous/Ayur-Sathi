"use client";

const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className={`p-6 rounded-xl shadow-md ${color}`}>
    <Icon size={32} className="mb-3 opacity-75" />
    <p className="text-3xl font-bold">{value}</p>
    <p className="text-sm font-medium opacity-80 mt-1">{title}</p>
  </div>
);

export default StatCard;
