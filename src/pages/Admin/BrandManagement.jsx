import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({ id: null, name: '', slug: '', description: '', status: 'Active' });

  const fetchBrands = async () => {
    try {
      const res = await axios.get('https://vertex-market-backend.vercel.app/api/brands/admin');
      setBrands(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load brands');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await axios.put(`https://vertex-market-backend.vercel.app/api/brands/${formData.id}`, formData);
        toast.success('Brand updated');
      } else {
        await axios.post('https://vertex-market-backend.vercel.app/api/brands', formData);
        toast.success('Brand created');
      }
      setIsModalOpen(false);
      fetchBrands();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving brand');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        await axios.delete(`https://vertex-market-backend.vercel.app/api/brands/${id}`);
        toast.success('Brand deleted');
        fetchBrands();
      } catch (error) {
        toast.error('Error deleting brand');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Brand Management</h2>
          <p className="text-sm text-gray-500">Manage all product brands in the marketplace</p>
        </div>
        <button
          onClick={() => { setFormData({ id: null, name: '', slug: '', description: '', status: 'Active' }); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-orange-700 transition"
        >
          <FiPlus /> Add Brand
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-100">
            <tr>
              <th className="py-4 px-6">Brand Name</th>
              <th className="py-4 px-6">Slug</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="4" className="text-center py-8 text-gray-500">Loading...</td></tr>
            ) : brands.map(brand => (
              <tr key={brand._id} className="hover:bg-gray-50 transition">
                <td className="py-4 px-6 font-medium text-gray-900">{brand.name}</td>
                <td className="py-4 px-6 text-gray-500">{brand.slug}</td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${brand.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {brand.status}
                  </span>
                </td>
                <td className="py-4 px-6 flex justify-end gap-2">
                  <button onClick={() => { setFormData({ id: brand._id, ...brand }); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <FiEdit />
                  </button>
                  <button onClick={() => handleDelete(brand._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{formData.id ? 'Edit' : 'Add'} Brand</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Brand Name *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Slug</label>
                <input type="text" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="w-full px-4 py-2 border rounded-xl" placeholder="Auto-generated if left blank" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 border rounded-xl bg-white">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-xl font-bold">Save Brand</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandManagement;
