import { useState, useEffect } from 'react';
import { FiShield, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

const SellerPolicies = () => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [policies, setPolicies] = useState({
    returnWindow: 'No Returns Accepted',
    returnConditions: '',
    shippingPolicy: ''
  });

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:5000/api/v1/seller/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          const seller = res.data.data;
          let rWindow = 'No Returns Accepted';
          let rCond = '';
          if (seller.returnPolicy) {
            try {
              const parsed = JSON.parse(seller.returnPolicy);
              rWindow = parsed.window || rWindow;
              rCond = parsed.conditions || rCond;
            } catch (e) {
              rCond = seller.returnPolicy;
            }
          }
          setPolicies({
            returnWindow: rWindow,
            returnConditions: rCond,
            shippingPolicy: seller.shippingPolicy || ''
          });
        }
      } catch (error) {
        console.error('Failed to load policies:', error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        returnPolicy: JSON.stringify({ window: policies.returnWindow, conditions: policies.returnConditions }),
        shippingPolicy: policies.shippingPolicy
      };
      
      await axios.put('http://127.0.0.1:5000/api/v1/seller/policies', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Store policies updated successfully!');
    } catch (error) {
      toast.error('Failed to update policies.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="p-6 text-center text-gray-500">Loading policies...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <FiShield className="text-[#ff6a00]" /> Store Policies
          </h1>
          <p className="text-sm text-gray-500 mt-1">Define your return, shipping, and warranty rules.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-[#ff6a00] hover:bg-[#e65c00] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md flex items-center gap-1 sm:p-2 transition-colors disabled:opacity-70"
        >
          {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FiSave />}
          {loading ? 'Saving...' : 'Save Policies'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-8">
        
        {/* Return Policy */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Return Policy</h3>
          <p className="text-xs text-gray-500 mb-4">Set the conditions under which customers can return your products.</p>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Return Window</label>
              <select 
                value={policies.returnWindow}
                onChange={(e) => setPolicies({ ...policies, returnWindow: e.target.value })}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50 outline-none w-full md:w-1/2 focus:border-[#ff6a00]"
              >
                <option>No Returns Accepted</option>
                <option>7 Days Return</option>
                <option>14 Days Return</option>
                <option>30 Days Return</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Return Conditions</label>
              <textarea 
                value={policies.returnConditions}
                onChange={(e) => setPolicies({ ...policies, returnConditions: e.target.value })}
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 outline-none w-full min-h-[100px] focus:border-[#ff6a00]" 
                placeholder="e.g. Items must be unopened in original packaging..."
              ></textarea>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Shipping Policy */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Shipping Policy</h3>
          <div className="flex flex-col gap-1.5">
            <textarea 
              value={policies.shippingPolicy}
              onChange={(e) => setPolicies({ ...policies, shippingPolicy: e.target.value })}
              className="border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 outline-none w-full min-h-[100px] focus:border-[#ff6a00]" 
              placeholder="Describe your processing times, shipping methods, and estimated delivery..."
            ></textarea>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SellerPolicies;

