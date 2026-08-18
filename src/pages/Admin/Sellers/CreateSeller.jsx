import { useState } from 'react';
import { FiMail, FiLock, FiCheck, FiShield } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CreateSeller = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '', 
    password: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let pass = '';
    for (let i = 0; i < 12; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    setFormData({ ...formData, password: pass });
    toast.success('Secure password generated!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('vertex_admin_auth_v1') || sessionStorage.getItem('vertex_admin_auth_v1'))?.token;
      await axios.post('http://127.0.0.1:5000/api/v1/admin/sellers/quick-create', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Seller account created successfully.');
      navigate('/admin/sellers');
    } catch (error) {
      if (error.response?.data?.message?.includes('already registered') || error.response?.data?.message?.includes('exists')) {
        toast.error('An account with this email already exists.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to create seller');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Create Seller Account</h1>
        <p className="text-gray-500 text-sm mt-1">Quickly add a new seller. They will complete their profile after logging in.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Email Address *</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-400" />
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-orange-500 outline-none transition-colors" placeholder="seller@example.com" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Password *</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FiLock className="absolute left-3 top-3 text-gray-400" />
                  <input required type="text" name="password" value={formData.password} onChange={handleChange} className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-orange-500 outline-none transition-colors" placeholder="Enter or generate password" />
                </div>
                <button type="button" onClick={generatePassword} className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 shrink-0">
                  <FiShield /> Generate Secure
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/admin/sellers')} className="px-6 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
            Cancel
          </button>
          <button disabled={loading} type="submit" className="px-6 py-3 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-lg shadow-orange-600/30 transition-all active:scale-95 flex items-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FiCheck />}
            Create Seller
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateSeller;
