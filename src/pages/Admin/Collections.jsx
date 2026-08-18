import { useState } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import AdminCard from '../../components/Admin/UI/AdminCard';

const Collections = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dummy collections for UI purposes
  const [collections, setCollections] = useState([
    { id: '1', name: 'Summer Essentials', items: 24, status: 'Active', featured: true },
    { id: '2', name: 'Tech Gadgets 2026', items: 45, status: 'Active', featured: true },
    { id: '3', name: 'Winter Clearance', items: 120, status: 'Draft', featured: false },
    { id: '4', name: 'Top Rated Beauty', items: 18, status: 'Active', featured: false },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Collections Management</h2>
          <p className="text-xs text-gray-500 mt-1">Create and manage curated product collections for the storefront.</p>
        </div>
        <button className="bg-[#ff6a00] hover:bg-[#e05e00] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm">
          <FiPlus />
          <span>Create Collection</span>
        </button>
      </div>

      <AdminCard>
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-full max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search collections..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#ff6a00]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 text-[10px] uppercase tracking-wider bg-white">
                <th className="p-4 font-bold">Collection Name</th>
                <th className="p-4 font-bold">Products</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Visibility</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {collections.map((col) => (
                <tr key={col.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-900">{col.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">ID: {col.id}</p>
                  </td>
                  <td className="p-4 font-medium text-gray-700">{col.items} items</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${col.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                      {col.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-gray-500">
                      {col.featured ? <FiEye className="text-blue-500" /> : <FiEyeOff />}
                      <span className="text-xs">{col.featured ? 'Featured' : 'Hidden'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                        <FiEdit2 size={16} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {collections.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500 text-sm">
                    No collections found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
};

export default Collections;
