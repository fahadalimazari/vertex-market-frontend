import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiEdit, FiTrash2, FiShield, FiCheckCircle, FiXCircle, FiMoreVertical } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const SellersList = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);

  const fetchSellers = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('vertex_admin_auth_v1') || sessionStorage.getItem('vertex_admin_auth_v1'))?.token;
      const { data } = await axios.get('http://127.0.0.1:5000/api/v1/admin/sellers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSellers(data.data);
    } catch (error) {
      toast.error('Failed to load sellers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const token = JSON.parse(localStorage.getItem('vertex_admin_auth_v1') || sessionStorage.getItem('vertex_admin_auth_v1'))?.token;
      await axios.patch(`http://127.0.0.1:5000/api/v1/admin/sellers/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Seller status updated to ${status}`);
      fetchSellers();
      setActiveDropdown(null);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this seller permanently?')) {
      try {
        const token = JSON.parse(localStorage.getItem('vertex_admin_auth_v1') || sessionStorage.getItem('vertex_admin_auth_v1'))?.token;
        await axios.delete(`http://127.0.0.1:5000/api/v1/admin/sellers/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Seller deleted successfully');
        fetchSellers();
      } catch (error) {
        toast.error('Failed to delete seller');
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Sellers Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all marketplace sellers and business accounts.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search sellers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-orange-500 outline-none transition-colors"
            />
          </div>
          <Link to="/admin/sellers/create" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-orange-500/30 transition-all whitespace-nowrap">
            + Add Seller
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Business / Seller</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sellers.filter(s => 
                s.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                s.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((seller) => (
                <tr key={seller._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg shrink-0">
                        {seller.storeName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{seller.storeName}</p>
                        <p className="text-xs text-gray-500">{seller.user?.firstName} {seller.user?.lastName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900 font-medium">{seller.user?.email}</p>
                    <p className="text-xs text-gray-500">{seller.user?.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      seller.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      seller.status === 'Suspended' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {seller.status === 'Approved' && <FiCheckCircle size={12} />}
                      {seller.status === 'Suspended' && <FiXCircle size={12} />}
                      {seller.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">
                    {new Date(seller.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === seller._id ? null : seller._id)}
                      className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FiMoreVertical />
                    </button>
                    
                    <AnimatePresence>
                      {activeDropdown === seller._id && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.95 }}
                          className="absolute right-6 top-10 w-48 bg-white border border-gray-100 shadow-xl rounded-xl py-2 z-50 text-left overflow-hidden"
                        >
                          <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Update Status</div>
                          <button onClick={() => handleStatusChange(seller._id, 'Active')} className="w-full px-4 py-2 text-xs font-bold text-green-600 hover:bg-green-50 flex items-center gap-2">
                            <FiCheckCircle size={14} /> Approve / Activate
                          </button>
                          <button onClick={() => handleStatusChange(seller._id, 'Suspended')} className="w-full px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2">
                            <FiXCircle size={14} /> Suspend Account
                          </button>
                          <div className="h-px bg-gray-100 my-1"></div>
                          <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actions</div>
                          <button onClick={() => handleDelete(seller._id)} className="w-full px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2">
                            <FiTrash2 size={14} /> Delete Seller
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                </tr>
              ))}
              {sellers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No sellers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellersList;
