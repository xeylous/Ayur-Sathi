"use client";
import React, { useState } from "react";
import { useCropCache } from "@/context/CropContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Edit, Trash2, Plus, X } from "lucide-react";

export default function ManageCropInfo() {
  const { infoList, refreshCrops } = useCropCache();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    _id: "", name: "", speciesId: "", image: "", uses: "", benefits: "", disadvantages: ""
  });

  const openModal = (info = null) => {
    if (info) {
      setFormData({
        _id: info._id,
        name: info.name,
        speciesId: info.speciesId,
        image: info.image,
        uses: info.uses.join(", "),
        benefits: info.benefits.join(", "),
        disadvantages: info.disadvantages.join(", ")
      });
      setIsEditing(true);
    } else {
      setFormData({ _id: "", name: "", speciesId: "", image: "", uses: "", benefits: "", disadvantages: "" });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result.success) {
        setFormData({ ...formData, image: result.url });
        toast.success("Image uploaded successfully!");
      } else {
        toast.error(`Upload failed: ${result.message}`);
      }
    } catch (err) {
      toast.error("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Parse comma separated arrays
    const payload = {
      ...formData,
      uses: formData.uses.split(",").map(s => s.trim()).filter(Boolean),
      benefits: formData.benefits.split(",").map(s => s.trim()).filter(Boolean),
      disadvantages: formData.disadvantages.split(",").map(s => s.trim()).filter(Boolean)
    };

    try {
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch("/api/crop-info", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(isEditing ? "Crop info updated!" : "Crop info added!");
        closeModal();
        refreshCrops();
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (err) {
      toast.error("Failed to save crop info.");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this crop info?")) return;
    try {
      const res = await fetch(`/api/crop-info?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Crop info deleted!");
        refreshCrops();
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (err) {
      toast.error("Failed to delete crop info.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-900">Manage Detailed Crop Info</h2>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <Plus size={18} /> Add New Info
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600">
              <th className="p-4 w-16">Image</th>
              <th className="p-4">Name & ID</th>
              <th className="p-4 w-1/3">Key Benefits</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {infoList?.map((info) => (
              <tr key={info._id} className="border-b border-gray-100 hover:bg-gray-50/50">
                <td className="p-4">
                  <img src={info.image} alt={info.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100 border" />
                </td>
                <td className="p-4">
                  <div className="font-medium text-gray-800">{info.name}</div>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">{info.speciesId}</div>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {info.benefits.slice(0, 2).map((b, i) => (
                      <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs border border-emerald-100">{b}</span>
                    ))}
                    {info.benefits.length > 2 && <span className="text-xs text-gray-400">+{info.benefits.length - 2} more</span>}
                  </div>
                </td>
                <td className="p-4 text-right flex justify-end gap-3 mt-2">
                  <button onClick={() => openModal(info)} className="text-blue-600 hover:text-blue-800" title="Edit">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(info._id)} className="text-red-500 hover:text-red-700" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {(!infoList || infoList.length === 0) && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">No crop info found. Add one above.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10">
              <h3 className="text-xl font-bold text-gray-800">{isEditing ? "Edit Crop Info" : "Add Crop Info"}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Species ID</label>
                  <input required type="text" value={formData.speciesId} onChange={(e) => setFormData({...formData, speciesId: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 uppercase" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (or Upload)</label>
                <div className="flex gap-2">
                  <input required type="url" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="flex-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="https://..." />
                  <label className={`flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 rounded-lg cursor-pointer transition-colors ${uploadingImage ? "opacity-50 cursor-not-allowed" : ""}`}>
                    {uploadingImage ? "Uploading..." : "Upload File"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                  </label>
                </div>
              </div>
              
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                <p className="text-xs text-amber-800 mb-3 flex items-center gap-1">
                  <strong>Note:</strong> Separate items with a comma (e.g., "Stress relief, Improves sleep")
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Uses (Comma separated)</label>
                    <input type="text" value={formData.uses} onChange={(e) => setFormData({...formData, uses: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Benefits (Comma separated)</label>
                    <input type="text" value={formData.benefits} onChange={(e) => setFormData({...formData, benefits: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Disadvantages / Warnings</label>
                    <input type="text" value={formData.disadvantages} onChange={(e) => setFormData({...formData, disadvantages: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={closeModal} className="flex-1 py-2 px-4 border text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50">
                  {loading ? "Saving..." : "Save Info"}
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
