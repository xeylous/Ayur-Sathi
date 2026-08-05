"use client";
import React, { useState } from "react";
import { useCropCache } from "@/context/CropContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Edit, Trash2, Plus, X } from "lucide-react";

export default function ManageSpecies() {
  const { speciesList, refreshCrops } = useCropCache();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ _id: "", name: "", speciesId: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const openModal = (species = null) => {
    if (species) {
      setFormData(species);
      setIsEditing(true);
    } else {
      setFormData({ _id: "", name: "", speciesId: "" });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ _id: "", name: "", speciesId: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch("/api/crop-species", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(isEditing ? "Species updated!" : "Species added!");
        closeModal();
        refreshCrops();
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (err) {
      toast.error("Failed to save species.");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this species?")) return;
    try {
      const res = await fetch(`/api/crop-species?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Species deleted!");
        refreshCrops();
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (err) {
      toast.error("Failed to delete species.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-900">Manage Crop Species</h2>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <Plus size={18} /> Add New
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600">
              <th className="p-4">Name</th>
              <th className="p-4">Species ID</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {speciesList?.map((s) => (
              <tr key={s._id} className="border-b border-gray-100 hover:bg-gray-50/50">
                <td className="p-4 text-gray-800 font-medium">{s.name}</td>
                <td className="p-4 text-gray-500">{s.speciesId}</td>
                <td className="p-4 text-right flex justify-end gap-3">
                  <button onClick={() => openModal(s)} className="text-blue-600 hover:text-blue-800" title="Edit">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(s._id)} className="text-red-500 hover:text-red-700" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {(!speciesList || speciesList.length === 0) && (
              <tr>
                <td colSpan="3" className="p-8 text-center text-gray-500">No species found. Add one above.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800">{isEditing ? "Edit Species" : "Add Species"}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Species Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="e.g. Ashwagandha"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Species ID (Unique Code)</label>
                <input 
                  required
                  type="text" 
                  value={formData.speciesId}
                  onChange={(e) => setFormData({...formData, speciesId: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none uppercase"
                  placeholder="e.g. ASW"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={closeModal} className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50">
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
}
