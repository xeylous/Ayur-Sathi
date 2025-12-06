import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Scan, FileText, BarChart3, Wallet ,Clock,CheckCircle } from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab }) {
  

  const links = [
    { id: "batch", label: "Batch Verification", icon: <Scan size={18} /> },
    { id: "pending", label: "Pending Batches", icon: <Clock size={18} /> },
    { id: "log", label: "Log Processing & QR", icon: <FileText size={18} /> },
    { id: "manufactured", label: "Manufactured Batches", icon: <CheckCircle size={18} /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
    { id: "payment", label: "Payment Withdraw", icon: <Wallet size={18} /> },
  ];



  return (
    <div className="bg-sidebar w-64 flex-shrink-0 text-white p-4 h-full">
      <h1 className="text-2xl font-bold py-4 mb-6 tracking-wide">
        <span className="text-green-300">Manu</span>Dash
      </h1>

      <nav>
        {links.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center w-full p-3 mb-2 rounded-xl transition-colors ${
              activeTab === item.id
                ? "bg-sidebar-active"
                : "hover:bg-sidebar-active/70"
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
