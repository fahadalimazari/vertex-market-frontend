import { useState, useEffect } from 'react';
import { sellerService } from '../../services/seller/sellerService';
import { FiUsers, FiPlus, FiEdit2, FiTrash2, FiShield, FiLoader, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SellerStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Operator'
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await sellerService.getStaff();
      if (res.success) {
        setStaff(res.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch staff list');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const res = await sellerService.addStaff(formData);
      if (res.success) {
        toast.success('Staff member added successfully');
        setIsModalOpen(false);
        setFormData({ name: '', email: '', role: 'Operator' });
        fetchStaff();
      }
    } catch (error) {
      toast.error('Failed to add staff member');
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm('Are you sure you want to remove this staff member?')) return;
    
    // Using axios directly or a new method in sellerService
    // Let's implement delete quickly via fetch or by adding it to service if needed,
    // Wait, sellerService doesn't have deleteStaff yet. Let's assume it does or use axios.
    // I'll add deleteStaff to sellerService next, but for now I'll use it assuming it's there.
    try {
      const { sessionService } = await import('../../services/auth/sessionService');
      const token = sessionService.getSession()?.token;
      const res = await fetch(`http://localhost:5000/api/v1/seller/staff/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Staff member removed');
        fetchStaff();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error('Failed to remove staff member');
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <FiLoader className="h-8 w-8 animate-spin text-[#ff6a00]" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 relative w-full min-w-0 max-w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 min-w-0">
        <div className="min-w-0 w-full md:w-auto">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2 truncate">
            <FiUsers className="text-[#ff6a00] shrink-0" /> Staff Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">Manage employee accounts and their permissions.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-[#ff6a00] hover:bg-[#e65c00] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-colors w-full md:w-auto shrink-0">
          <FiPlus /> Add Staff Member
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-w-0 w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-[10px] sm:text-sm min-w-full">
            <thead className="bg-gray-50 text-gray-600 font-bold">
              <tr>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Name</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Email</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Role</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">Status</th>
                <th className="px-1 sm:px-4 py-2 sm:py-4 text-right whitespace-normal sm:whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {staff.map(member => (
                <tr key={member._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-1 sm:px-4 py-2 sm:py-4 font-bold text-gray-900 whitespace-normal sm:whitespace-nowrap">{member.name}</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 text-gray-600 whitespace-normal sm:whitespace-nowrap">{member.email}</td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                      <FiShield className="shrink-0" /> {member.role}
                    </span>
                  </td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 whitespace-normal sm:whitespace-nowrap">
                    <span className="inline-block text-green-600 font-bold text-[10px] uppercase bg-green-50 px-2 py-0.5 rounded-full">
                      {member.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-1 sm:px-4 py-2 sm:py-4 text-right whitespace-normal sm:whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleDeleteStaff(member._id)} className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors shrink-0" title="Remove">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {staff.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    No staff members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-900">Add Staff Member</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                  placeholder="e.g. Ali Khan"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                  placeholder="e.g. ali@store.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                >
                  <option value="Manager">Manager</option>
                  <option value="Operator">Operator</option>
                  <option value="Viewer">Viewer</option>
                  <option value="Support">Support</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-[#ff6a00] hover:bg-[#e65c00] text-white py-2.5 rounded-xl font-bold transition-colors mt-2">
                Create Staff Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerStaff;
